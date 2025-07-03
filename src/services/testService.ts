import { getUserTestAnswers } from '../lib/database'
import type { UserAnswer } from '../lib/database'

interface UserAnswerWithDetails extends UserAnswer {
  answer_options?: { is_correct: boolean }
  questions?: { points: number }
}

export const calculateTestScore = async (userTestId: string): Promise<number> => {
  const userAnswers = await getUserTestAnswers(userTestId) as UserAnswerWithDetails[]
  let totalScore = 0
  userAnswers.forEach((answer) => {
    if (answer.answer_options?.is_correct) {
      totalScore += answer.questions?.points || 0
    }
  })
  return totalScore
} 