import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ITestsDAL } from "../di/interfaces/dal.interfaces";
import {
  BasicAnswerOption,
  BasicTest,
  FullTest,
  TestResult,
  TestSubmission,
} from "@/services/interfaces/service.interfaces";

type QuestionWithOptions = {
  id: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  created_at: string;
  updated_at: string;
  options: Array<BasicAnswerOption>;
};

export class TestsDAL implements ITestsDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getTests(courseId: string): Promise<BasicTest[]> {
    const { data, error } = await this.supabase
      .from("tests")
      .select(
        `
        *,
        questions:questions(count)
      `
      )
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching tests: ${error.message}`);
    }

    return (data || []).map((test) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      questionsCount: test.questions[0]?.count || 0,
      created_at: test.created_at,
      updated_at: test.updated_at,
    }));
  }

  async getTestById(id: string): Promise<FullTest | null> {
    const { data, error } = await this.supabase
      .from("tests")
      .select(
        `
        *,
        questions (
          id,
          text,
          type,
          points,
          created_at,
          updated_at,
          options:answer_options (
            id,
            text
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching test: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: (data.questions as QuestionWithOptions[]).map((question) => ({
        ...question,
        options: question.options || [],
      })),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getTestResults(
    courseId: string,
    userId: string
  ): Promise<TestResult[]> {
    const { data, error } = await this.supabase
      .from("tests")
      .select(
        `
        id,
        questions(id, points),
        user_tests!inner (
          id,
          score
        )
      `
      )
      .eq("course_id", courseId)
      .eq("user_tests.user_id", userId);

    if (error) {
      throw new Error(`Error fetching test results: ${error.message}`);
    }

    return (data || []).map((test) => {
      const maxScore = test.questions.reduce((sum, q) => sum + q.points, 0);
      const score = test.user_tests[0]?.score || 0;

      return {
        testId: test.id,
        score,
        maxScore,
      };
    });
  }

  async createScore(
    testId: string,
    userId: string,
    submission: TestSubmission
  ): Promise<TestResult> {
    // First, get the correct answers and points for each question
    const { data: questions, error: questionsError } = await this.supabase
      .from("questions")
      .select(
        `
        id,
        points,
        answer_options (
          id,
          is_correct
        )
      `
      )
      .eq("test_id", testId);

    if (questionsError) {
      throw new Error(`Error fetching questions: ${questionsError.message}`);
    }

    if (!questions) {
      throw new Error("No questions found for this test");
    }

    // Calculate scores
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      maxScore += question.points;
      const submittedAnswers = submission[question.id] || [];
      const correctAnswers = question.answer_options
        .filter((option) => option.is_correct)
        .map((option) => option.id);

      // For single choice questions, check exact match
      // For multiple choice, check all correct answers are selected and no incorrect ones
      const isCorrect =
        submittedAnswers.length === correctAnswers.length &&
        submittedAnswers.every((answer) => correctAnswers.includes(answer));

      if (isCorrect) {
        totalScore += question.points;
      }
    });

    // Create or update user_test entry
    const { data: userTest, error: userTestError } = await this.supabase
      .from("user_tests")
      .upsert(
        {
          user_id: userId,
          test_id: testId,
          score: totalScore,
        },
        {
          onConflict: "user_id,test_id",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (userTestError) {
      throw new Error(`Error saving test score: ${userTestError.message}`);
    }

    // Handle user answers with upsert logic
    if (Object.keys(submission).length > 0) {
      const userAnswers = Object.entries(submission).flatMap(
        ([questionId, answerIds]) =>
          answerIds.map((answerId) => ({
            user_test_id: userTest.id,
            question_id: questionId,
            answer_option_id: answerId,
          }))
      );

      if (userAnswers.length > 0) {
        const { error: answersError } = await this.supabase
          .from("user_answers")
          .upsert(userAnswers, {
            onConflict: "user_test_id,question_id,answer_option_id",
            ignoreDuplicates: false,
          });

        if (answersError) {
          throw new Error(`Error saving user answers: ${answersError.message}`);
        }
      }
    }

    return {
      testId,
      score: totalScore,
      maxScore,
    };
  }
}
