// カテゴリテスト型定義

export interface TestQuestion {
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
  questions: TestQuestion[]
}

// Calculate test score
export function calculateTestScore(answers: number[], test: CategoryTest): {
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  incorrectCount: number
} {
  let correctCount = 0
  
  for (let i = 0; i < test.questions.length; i++) {
    if (answers[i] === test.questions[i].correctAnswer) {
      correctCount++
    }
  }
  
  const percentage = Math.round((correctCount / test.totalQuestions) * 100)
  
  return {
    score: correctCount * 2,
    percentage,
    passed: percentage >= test.passingScore,
    correctCount,
    incorrectCount: test.totalQuestions - correctCount,
  }
}
