import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ITestsDAL } from "../di/interfaces/dal.interfaces";
import {
  BasicAnswerOption,
  BasicTest,
  CreateTestInput,
  FullTest,
  FullQuestion,
  SaveQuestionsInput,
  TestResult,
  TestSubmission,
  QuestionType,
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

  async getTestQuestions(testId: string): Promise<FullQuestion[]> {
    const { data, error } = await this.supabase
      .from("questions")
      .select(
        `
        *,
        answer_options (
          *
        )
      `
      )
      .eq("test_id", testId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching test questions: ${error.message}`);
    }

    return (data || []).map((question) => ({
      id: question.id,
      text: question.text,
      type: question.type as QuestionType,
      points: question.points,
      test_id: question.test_id,
      options: question.answer_options || [],
      created_at: question.created_at,
      updated_at: question.updated_at,
    }));
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

  async updateTest(id: string, data: CreateTestInput): Promise<BasicTest> {
    const { data: test, error } = await this.supabase
      .from("tests")
      .update({
        title: data.title,
        description: data.description,
      })
      .eq("id", id)
      .select(
        `
        *,
        questions:questions(count)
      `
      )
      .single();

    if (error) {
      throw new Error(`Error updating test: ${error.message}`);
    }

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      questionsCount: test.questions[0]?.count || 0,
      created_at: test.created_at,
      updated_at: test.updated_at,
    };
  }

  async createTest(courseId: string, data: CreateTestInput): Promise<BasicTest> {
    const { data: test, error } = await this.supabase
      .from("tests")
      .insert({
        course_id: courseId,
        title: data.title,
        description: data.description,
      })
      .select(
        `
        *,
        questions:questions(count)
      `
      )
      .single();

    if (error) {
      throw new Error(`Error creating test: ${error.message}`);
    }

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      questionsCount: test.questions[0]?.count || 0,
      created_at: test.created_at,
      updated_at: test.updated_at,
    };
  }

  async saveQuestions(data: SaveQuestionsInput): Promise<FullTest> {
    const { testId, questions } = data;

    try {
      // Delete existing questions and their options
      const { error: deleteError } = await this.supabase
        .from("questions")
        .delete()
        .eq("test_id", testId);

      if (deleteError) {
        throw new Error(`Error deleting questions: ${deleteError.message}`);
      }

      // Insert new questions
      for (const question of questions) {
        const { data: newQuestion, error: questionError } = await this.supabase
          .from("questions")
          .insert({
            test_id: testId,
            text: question.text,
            type: question.type,
            points: question.points,
          })
          .select()
          .single();

        if (questionError) {
          throw new Error(`Error creating question: ${questionError.message}`);
        }

        // Insert options for the question
        if (question.options.length > 0) {
          const optionsToInsert = question.options.map((option: { text: string; isCorrect: boolean }) => ({
            question_id: newQuestion.id,
            text: option.text,
            is_correct: option.isCorrect,
          }));

          const { error: optionsError } = await this.supabase
            .from("answer_options")
            .insert(optionsToInsert);

          if (optionsError) {
            throw new Error(`Error creating options: ${optionsError.message}`);
          }
        }
      }

      // Return updated test
      const updatedTest = await this.getTestById(testId);
      if (!updatedTest) {
        throw new Error("Failed to retrieve updated test");
      }
      return updatedTest;
    } catch (error) {
      throw new Error(`Failed to save questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
