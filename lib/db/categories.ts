import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Category } from "@/lib/training-data"

// 全カテゴリを取得（トレーニング数を含む）
export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()

  // カテゴリを取得
  const { data: categories, error } = await supabase
    .from("training_categories")
    .select("*")
    .order("display_order")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // 各カテゴリのトレーニング数を取得
  const { data: trainingCounts, error: countError } = await supabase
    .from("trainings")
    .select("category_id")

  if (countError) {
    console.error("Error fetching training counts:", countError)
  }

  // カテゴリごとのトレーニング数をカウント
  const countMap: Record<string, number> = {}
  if (trainingCounts) {
    trainingCounts.forEach((t) => {
      countMap[t.category_id] = (countMap[t.category_id] || 0) + 1
    })
  }

  // カテゴリを変換
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    totalDuration: cat.total_duration,
    targetLevel: cat.target_level,
    color: cat.color,
    trainingCount: countMap[cat.id] || 0,
    trainings: [],
  }))
}

/**
 * 全カテゴリ＋研修＋テスト有無を取得（ISR / 静的生成用）。
 * cookies() を呼ばないため静的コンテキストで安全に使える。
 */
export async function getAllCategoriesWithTrainings(client: SupabaseClient): Promise<Category[]> {
  const [catRes, trainRes, testRes] = await Promise.all([
    client.from("training_categories").select("*").order("display_order"),
    client.from("trainings").select("id, category_id, title, subtitle, duration, level, detail, display_order").order("display_order"),
    client.from("category_tests").select("category_id"),
  ])

  if (catRes.error || !catRes.data) return []

  const categoryIdsWithTest = new Set((testRes.data ?? []).map((t) => t.category_id))

  return catRes.data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    totalDuration: cat.total_duration,
    targetLevel: cat.target_level,
    color: cat.color,
    hasTest: categoryIdsWithTest.has(cat.id),
    trainings: (trainRes.data ?? [])
      .filter((t) => t.category_id === cat.id)
      .map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: t.subtitle,
        duration: t.duration,
        level: t.level,
        detail: t.detail,
      })),
  }))
}

// 単一カテゴリを取得
export async function getCategoryByIdFromDb(id: string, client?: SupabaseClient): Promise<Category | null> {
  const supabase = client ?? await createClient()

  const { data: category, error } = await supabase
    .from("training_categories")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !category) {
    console.error("Error fetching category:", error)
    return null
  }

  // そのカテゴリのトレーニングを取得
  const { data: trainings, error: trainingsError } = await supabase
    .from("trainings")
    .select("*")
    .eq("category_id", id)
    .order("display_order")

  if (trainingsError) {
    console.error("Error fetching trainings:", trainingsError)
  }

  const trainingIds = (trainings ?? []).map((t) => t.id)
  let hasDeepDive = false

  if (trainingIds.length > 0) {
    // 並列実行: トレーニング単位とカテゴリ単位の深掘りを同時にチェック
    const [deepDiveResult, categoryDeepDiveResult] = await Promise.all([
      supabase
        .from("deep_dive_contents")
        .select("*", { count: "exact", head: true })
        .in("training_id", trainingIds),
      supabase
        .from("category_deep_dive_contents")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id),
    ])
    hasDeepDive = (deepDiveResult.count ?? 0) > 0 || (categoryDeepDiveResult.count ?? 0) > 0
  } else {
    // トレーニングがない場合はカテゴリ単位のみチェック
    const { count: categoryCount } = await supabase
      .from("category_deep_dive_contents")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)
    hasDeepDive = (categoryCount ?? 0) > 0
  }

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    totalDuration: category.total_duration,
    targetLevel: category.target_level,
    color: category.color,
    hasDeepDive,
    trainings: trainings?.map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      duration: t.duration,
      level: t.level,
      detail: t.detail,
    })) || [],
  }
}

// トレーニングIDから単一トレーニングとそのカテゴリを取得
export async function getTrainingByIdFromDb(trainingId: number, client?: SupabaseClient): Promise<{
  training: Category["trainings"][0]
  category: Category
} | null> {
  const supabase = client ?? await createClient()

  // トレーニングを取得
  const { data: training, error } = await supabase
    .from("trainings")
    .select("*")
    .eq("id", trainingId)
    .single()

  if (error || !training) {
    console.error("Error fetching training:", error)
    return null
  }

  // そのトレーニングのカテゴリを取得
  const { data: category, error: categoryError } = await supabase
    .from("training_categories")
    .select("*")
    .eq("id", training.category_id)
    .single()

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError)
    return null
  }

  return {
    training: {
      id: training.id,
      title: training.title,
      subtitle: training.subtitle,
      duration: training.duration,
      level: training.level,
      detail: training.detail,
    },
    category: {
      id: category.id,
      name: category.name,
      description: category.description,
      totalDuration: category.total_duration,
      targetLevel: category.target_level,
      color: category.color,
      trainings: [],
    },
  }
}

// 全トレーニングIDを取得（generateStaticParams用）
export async function getAllTrainingIds(client?: SupabaseClient): Promise<{ id: string }[]> {
  const supabase = client ?? await createClient()

  const { data: trainings, error } = await supabase
    .from("trainings")
    .select("id")
    .order("id")

  if (error) {
    console.error("Error fetching training ids:", error)
    return []
  }

  return trainings.map((t) => ({ id: String(t.id) }))
}

// 全カテゴリIDを取得（generateStaticParams用）
export async function getAllCategoryIds(client?: SupabaseClient): Promise<{ id: string }[]> {
  const supabase = client ?? await createClient()

  const { data: categories, error } = await supabase
    .from("training_categories")
    .select("id")
    .order("display_order")

  if (error) {
    console.error("Error fetching category ids:", error)
    return []
  }

  return categories.map((c) => ({ id: c.id }))
}

// Deep Diveコンテンツの型定義
export interface DeepDiveContent {
  id: number
  trainingId: number
  title: string
  subtitle: string | null
  introduction: string
  sections: { title: string; content: string }[]
  conclusion: string
  references: string[] | null
}

// Deep Diveコンテンツを取得
export async function getDeepDiveContentFromDb(trainingId: number, client?: SupabaseClient): Promise<DeepDiveContent | null> {
  const supabase = client ?? await createClient()

  const { data, error } = await supabase
    .from("deep_dive_contents")
    .select("*")
    .eq("training_id", trainingId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    trainingId: data.training_id,
    title: data.title,
    subtitle: data.subtitle,
    introduction: data.introduction,
    sections: data.sections || [],
    conclusion: data.conclusion,
    references: data.reference_list || null,
  }
}

// Deep Diveが存在するトレーニングIDを取得（generateStaticParams用）
export async function getAllDeepDiveTrainingIds(): Promise<{ id: string }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deep_dive_contents")
    .select("training_id")
    .order("training_id")

  if (error) {
    console.error("Error fetching deep dive training ids:", error)
    return []
  }

  return data.map((d) => ({ id: String(d.training_id) }))
}

// カテゴリテストの型定義
export interface CategoryTestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  source: string
}

export interface CategoryTest {
  categoryId: string
  categoryName: string
  totalQuestions: number
  passingScore: number
  timeLimit: number
  questions: CategoryTestQuestion[]
}

// カテゴリテストを取得
export async function getCategoryTestFromDb(categoryId: string, client?: SupabaseClient): Promise<CategoryTest | null> {
  const supabase = client ?? await createClient()

  // カテゴリテスト設定を取得
  const { data: testData, error: testError } = await supabase
    .from("category_tests")
    .select("*")
    .eq("category_id", categoryId)
    .single()

  if (testError || !testData) {
    // PGRST116 = "not found" (single row expected but 0 returned) — normal for categories without a test
    if (testError?.code !== "PGRST116") {
      console.error("Error fetching category test:", testError)
    }
    return null
  }

  // 問題を取得
  const { data: questions, error: questionsError } = await supabase
    .from("category_test_questions")
    .select("*")
    .eq("category_test_id", testData.id)
    .order("question_number")

  if (questionsError) {
    console.error("Error fetching test questions:", questionsError)
    return null
  }

  return {
    categoryId: testData.category_id,
    categoryName: testData.category_name,
    totalQuestions: testData.total_questions,
    passingScore: testData.passing_score,
    timeLimit: testData.time_limit,
    questions: questions.map((q) => ({
      id: q.question_number,
      question: q.question,
      options: q.options as string[],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      source: q.source,
    })),
  }
}

// テストが存在するカテゴリIDを取得
export async function getAllTestCategoryIds(): Promise<{ id: string }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("category_tests")
    .select("category_id")
    .order("category_id")

  if (error) {
    console.error("Error fetching test category ids:", error)
    return []
  }

  return data.map((d) => ({ id: d.category_id }))
}

// カテゴリ単位の深掘りコンテンツ（C の「中古車流通の構造と現状」など）
export interface CategoryDeepDiveContent {
  categoryId: string
  title: string
  subtitle: string | null
  bodyHtml: string
}

export async function getCategoryDeepDiveFromDb(categoryId: string): Promise<CategoryDeepDiveContent | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("category_deep_dive_contents")
    .select("category_id, title, subtitle, body_html")
    .eq("category_id", categoryId)
    .single()

  if (error || !data) return null

  return {
    categoryId: data.category_id,
    title: data.title,
    subtitle: data.subtitle,
    bodyHtml: data.body_html,
  }
}

// 修了テスト型定義
export interface FinalExamQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  source: string
  difficulty: "basic" | "intermediate" | "advanced"
}

export interface FinalExam {
  totalQuestions: number
  passingScore: number
  timeLimit: number
  questions: FinalExamQuestion[]
}

// 修了テストを取得
export async function getFinalExamFromDb(): Promise<FinalExam | null> {
  const supabase = await createClient()

  // 並列実行: config と questions を同時に取得
  const [configResult, questionsResult] = await Promise.all([
    supabase
      .from("final_exam_config")
      .select("*")
      .eq("id", 1)
      .single(),
    supabase
      .from("final_exam_questions")
      .select("*")
      .order("question_number"),
  ])

  if (configResult.error || !configResult.data) {
    console.error("Error fetching final exam config:", configResult.error)
    return null
  }

  if (questionsResult.error || !questionsResult.data) {
    console.error("Error fetching final exam questions:", questionsResult.error)
    return null
  }

  const config = configResult.data
  const questions = questionsResult.data

  return {
    totalQuestions: config.total_questions,
    passingScore: config.passing_score,
    timeLimit: config.time_limit,
    questions: questions.map((q) => ({
      id: q.question_number,
      question: q.question,
      options: q.options as string[],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      source: q.source,
      difficulty: q.difficulty as "basic" | "intermediate" | "advanced",
    })),
  }
}
