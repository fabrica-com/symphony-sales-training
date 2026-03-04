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
      score: 16,
      totalQuestions: 10,
      userName: 'テスト太郎',
    })

    let body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('カテゴリテスト完了')
    expect(body).toContain('テスト太郎')
    expect(body).toContain('16 / 20 pt')
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
      score: 8,
      totalQuestions: 10,
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
      score: 92,
      totalQuestions: 100,
      userName: 'テスト太郎',
    })

    const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
    expect(body).toContain('修了テスト完了')
    expect(body).toContain('テスト太郎')
    expect(body).toContain('92 / 100 問正解')
    expect(body).toContain('92%')
    expect(body).toContain('✅ 合格')
  })

  // カテゴリテスト 4パターン（合格ライン70%想定: 20問中14問正解=70%）
  describe('category_test 合否パターン', () => {
    beforeEach(() => {
      process.env.CHATWORK_API_TOKEN = 'test-token'
      process.env.CHATWORK_ROOM_ID = '12345'
    })

    it('余裕の合格（80%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'category_test',
        userId: 'user-1',
        categoryId: 'A',
        categoryName: '基礎マインドセット',
        percentage: 80,
        passed: true,
        score: 32,
        totalQuestions: 20,
        userName: '合格太郎',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('合格太郎')
      expect(body).toContain('32 / 40 pt')
      expect(body).toContain('80%')
      expect(body).toContain('✅ 合格')
    })

    it('ギリ合格（70%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'category_test',
        userId: 'user-1',
        categoryId: 'B',
        categoryName: '商品知識',
        percentage: 70,
        passed: true,
        score: 28,
        totalQuestions: 20,
        userName: 'ギリ合格子',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('ギリ合格子')
      expect(body).toContain('28 / 40 pt')
      expect(body).toContain('70%')
      expect(body).toContain('✅ 合格')
    })

    it('ギリ不合格（65%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'category_test',
        userId: 'user-1',
        categoryId: 'C',
        categoryName: '営業プロセス',
        percentage: 65,
        passed: false,
        score: 26,
        totalQuestions: 20,
        userName: 'ギリ不合格男',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('ギリ不合格男')
      expect(body).toContain('26 / 40 pt')
      expect(body).toContain('65%')
      expect(body).toContain('❌ 不合格')
    })

    it('明らかな不合格（30%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'category_test',
        userId: 'user-1',
        categoryId: 'D',
        categoryName: '商談テクニック',
        percentage: 30,
        passed: false,
        score: 12,
        totalQuestions: 20,
        userName: '不合格次郎',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('不合格次郎')
      expect(body).toContain('12 / 40 pt')
      expect(body).toContain('30%')
      expect(body).toContain('❌ 不合格')
    })
  })

  // 修了テスト 4パターン（合格ライン90%: 100問中90問正解=90%）
  describe('final_exam 合否パターン', () => {
    beforeEach(() => {
      process.env.CHATWORK_API_TOKEN = 'test-token'
      process.env.CHATWORK_ROOM_ID = '12345'
    })

    it('余裕の合格（95%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'final_exam',
        userId: 'user-1',
        percentage: 95,
        passed: true,
        score: 95,
        totalQuestions: 100,
        userName: '優秀花子',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('優秀花子')
      expect(body).toContain('95 / 100 問正解')
      expect(body).toContain('95%')
      expect(body).toContain('✅ 合格')
    })

    it('ギリ合格（90%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'final_exam',
        userId: 'user-1',
        percentage: 90,
        passed: true,
        score: 90,
        totalQuestions: 100,
        userName: 'ギリ合格美',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('ギリ合格美')
      expect(body).toContain('90 / 100 問正解')
      expect(body).toContain('90%')
      expect(body).toContain('✅ 合格')
    })

    it('ギリ不合格（89%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'final_exam',
        userId: 'user-1',
        percentage: 89,
        passed: false,
        score: 89,
        totalQuestions: 100,
        userName: 'ギリ不合格子',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('ギリ不合格子')
      expect(body).toContain('89 / 100 問正解')
      expect(body).toContain('89%')
      expect(body).toContain('❌ 不合格')
    })

    it('明らかな不合格（50%）', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      await notifyChatworkTaskCompleted({
        kind: 'final_exam',
        userId: 'user-1',
        percentage: 50,
        passed: false,
        score: 50,
        totalQuestions: 100,
        userName: '不合格太郎',
      })
      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body).get('body')!
      expect(body).toContain('不合格太郎')
      expect(body).toContain('50 / 100 問正解')
      expect(body).toContain('50%')
      expect(body).toContain('❌ 不合格')
    })
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
