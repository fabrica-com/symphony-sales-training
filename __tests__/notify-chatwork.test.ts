import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notifyChatworkTaskCompleted } from '@/lib/notify-chatwork'

// fetch をモック
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('notifyChatworkTaskCompleted', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // デフォルトは環境変数なし（モックモード）
    delete process.env.CHATWORK_API_TOKEN
    delete process.env.CHATWORK_ROOM_ID
  })

  it('環境変数未設定の場合、fetch を呼ばない', async () => {
    await notifyChatworkTaskCompleted({
      kind: 'training',
      userId: 'user-1',
      trainingId: 1,
      trainingTitle: 'テスト研修',
      score: 8,
      maxScore: 10,
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('環境変数設定時、training 通知で正しい API を呼ぶ', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'
    mockFetch.mockResolvedValueOnce({ ok: true })

    await notifyChatworkTaskCompleted({
      kind: 'training',
      userId: 'user-1',
      trainingId: 3,
      trainingTitle: '断られることへの向き合い方',
      categoryName: '基礎マインドセット',
      score: 8,
      maxScore: 10,
      userName: 'テスト太郎',
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://api.chatwork.com/v2/rooms/12345/messages')
    expect(options.method).toBe('POST')
    expect(options.headers['x-chatworktoken']).toBe('test-token')

    const body = new URLSearchParams(options.body).get('body')!
    expect(body).toContain('研修完了通知')
    expect(body).toContain('テスト太郎')
    expect(body).toContain('基礎マインドセット')
    expect(body).toContain('8 / 10 pt')
  })

  it('training 通知で trainingId が2桁ゼロ埋めされる', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'
    mockFetch.mockResolvedValueOnce({ ok: true })

    await notifyChatworkTaskCompleted({
      kind: 'training',
      userId: 'user-1',
      trainingId: 3,
      trainingTitle: 'テスト',
      score: 5,
      maxScore: 10,
    })

    const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('03 テスト') // ゼロ埋め
  })

  it('training 通知に気分・振り返り・ワーク回答が含まれる', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'
    mockFetch.mockResolvedValueOnce({ ok: true })

    await notifyChatworkTaskCompleted({
      kind: 'training',
      userId: 'user-1',
      trainingId: 1,
      trainingTitle: 'テスト',
      score: 10,
      maxScore: 10,
      moodEmoji: '😤',
      moodLabel: '気合い十分！',
      reflectionText: '今日は集中できた',
      workAnswers: [
        { label: '目標', value: '月10件' },
      ],
    })

    const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('😤 気合い十分！')
    expect(body).toContain('今日は集中できた')
    expect(body).toContain('目標: 月10件')
  })

  it('category_test 通知で合格/不合格が正しく表示される', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'

    // 合格
    mockFetch.mockResolvedValueOnce({ ok: true })
    await notifyChatworkTaskCompleted({
      kind: 'category_test',
      userId: 'user-1',
      categoryId: 'A',
      categoryName: '基礎マインドセット',
      percentage: 80,
      passed: true,
    })

    let body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('カテゴリテスト完了')
    expect(body).toContain('80%')
    expect(body).toContain('✅ 合格')

    // 不合格
    mockFetch.mockResolvedValueOnce({ ok: true })
    await notifyChatworkTaskCompleted({
      kind: 'category_test',
      userId: 'user-1',
      categoryId: 'A',
      categoryName: '基礎マインドセット',
      percentage: 40,
      passed: false,
    })

    body = new URLSearchParams(mockFetch.mock.calls[1][1].body).get('body')!
    expect(body).toContain('❌ 不合格')
  })

  it('final_exam 通知が正しく送信される', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'
    mockFetch.mockResolvedValueOnce({ ok: true })

    await notifyChatworkTaskCompleted({
      kind: 'final_exam',
      userId: 'user-1',
      percentage: 92,
      passed: true,
    })

    const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('修了テスト完了')
    expect(body).toContain('92%')
    expect(body).toContain('✅ 合格')
  })

  it('API エラー時にクラッシュしない', async () => {
    process.env.CHATWORK_API_TOKEN = 'test-token'
    process.env.CHATWORK_ROOM_ID = '12345'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Rate limited'),
    })

    // エラーを投げずに完了する
    await expect(
      notifyChatworkTaskCompleted({
        kind: 'training',
        userId: 'user-1',
        trainingId: 1,
        trainingTitle: 'テスト',
        score: 5,
        maxScore: 10,
      })
    ).resolves.toBeUndefined()
  })
})
