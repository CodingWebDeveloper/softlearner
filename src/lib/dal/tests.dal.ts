import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ITestsDAL } from "../di/interfaces/dal.interfaces";
import { PaginatedResult } from "../di/interfaces/dal.interfaces";
import {
  BasicAnswerOption,
  BasicTest,
  CreateTestInput,
  FullTest,
  FullQuestion,
  QuestionsInput,
  TestResult,
  TestSubmission,
  QuestionType,
  QuestionInput,
  OptionInput,
  RecentUserTestResult,
  StudentTestResult,
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
      `,
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
      variant: test.variant,
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
      `,
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
      variant: data.variant,
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
          id,
          text,
          is_correct
        )
      `,
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
    userId: string,
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
      `,
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
        variant: data.variant,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        questions:questions(count)
      `,
      )
      .single();

    if (error) {
      throw new Error(`Error updating test: ${error.message}`);
    }

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      variant: test.variant,
      questionsCount: test.questions[0]?.count || 0,
      created_at: test.created_at,
      updated_at: test.updated_at,
    };
  }

  async createTest(
    courseId: string,
    data: CreateTestInput,
  ): Promise<BasicTest> {
    const { data: test, error } = await this.supabase
      .from("tests")
      .insert({
        course_id: courseId,
        title: data.title,
        description: data.description,
        variant: data.variant,
      })
      .select(
        `
        *,
        questions:questions(count)
      `,
      )
      .single();

    if (error) {
      throw new Error(`Error creating test: ${error.message}`);
    }

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      variant: test.variant,
      questionsCount: test.questions[0]?.count || 0,
      created_at: test.created_at,
      updated_at: test.updated_at,
    };
  }

  async saveQuestions(data: QuestionsInput): Promise<FullTest> {
    const { testId, questions } = data;

    try {
      // Determine and delete removed questions
      const { data: existingQuestions, error: existingQError } =
        await this.supabase
          .from("questions")
          .select("id")
          .eq("test_id", testId);

      if (existingQError) {
        throw new Error(
          `Error fetching existing questions: ${existingQError.message}`,
        );
      }

      const existingIds = (existingQuestions || []).map((q) => q.id as string);
      const submittedIds = (questions || [])
        .map((q) => q.id)
        .filter((id): id is string => Boolean(id));

      const toDeleteQuestionIds = existingIds.filter(
        (id) => !submittedIds.includes(id),
      );
      for (const qId of toDeleteQuestionIds) {
        await this.deleteQuestion(qId);
      }

      for (const question of questions) {
        switch (question.status) {
          case "INITIAL":
            await this.processOptions(question.id as string, question.options);
            break;
          case "NEW":
            await this.createQuestionWithOptions(testId, question);
            break;
          case "UPDATED":
            if (question.id) {
              await this.updateQuestionWithOptions(question);
            }
            break;
        }
      }

      // Return updated test
      const updatedTest = await this.getTestById(testId);
      if (!updatedTest) {
        throw new Error("Failed to retrieve updated test");
      }
      return updatedTest;
    } catch (error) {
      throw new Error(
        `Failed to save questions: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  private async createQuestionWithOptions(
    testId: string,
    question: QuestionInput,
  ) {
    const { data: testData, error: testError } = await this.supabase
      .from("tests")
      .select(
        `
        id,
        course_id,
        courses!inner (
          id,
          creator_id
        )
      `,
      )
      .eq("id", testId)
      .single();

    if (testError || !testData) {
      throw new Error(
        `Test not found: ${testError?.message || "Test not found"}`,
      );
    }

    const { data: newQuestion, error } = await this.supabase
      .from("questions")
      .insert({
        test_id: testId,
        text: question.text,
        type: question.type,
        points: question.points,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating question: ${error.message}`);
    }

    const newOptions = question.options.filter(
      (opt: OptionInput) => opt.status === "NEW",
    );
    if (newOptions.length > 0) {
      const { error: optionsError } = await this.supabase
        .from("answer_options")
        .insert(
          newOptions.map((opt) => ({
            question_id: newQuestion.id,
            text: opt.text,
            is_correct: opt.isCorrect,
          })),
        );

      if (optionsError)
        throw new Error(`Error creating options: ${optionsError.message}`);
    }

    return newQuestion;
  }

  private async updateQuestionWithOptions(question: QuestionInput) {
    const { error } = await this.supabase
      .from("questions")
      .update({
        text: question.text,
        type: question.type,
        points: question.points,
        updated_at: new Date().toISOString(),
      })
      .eq("id", question.id as string);

    if (error) throw new Error(`Error updating question: ${error.message}`);

    await this.processOptions(
      question.id as string,
      question.options as OptionInput[],
    );
  }

  private async processOptions(questionId: string, options: OptionInput[]) {
    for (const option of options) {
      switch (option.status) {
        case "NEW":
          await this.supabase.from("answer_options").insert({
            question_id: questionId,
            text: option.text,
            is_correct: option.isCorrect,
          });
          break;

        case "UPDATED":
          if (option.id) {
            await this.supabase
              .from("answer_options")
              .update({
                text: option.text,
                is_correct: option.isCorrect,
                updated_at: new Date().toISOString(),
              })
              .eq("id", option.id as string);
          }
          break;
      }
    }
  }

  async deleteTest(id: string): Promise<void> {
    const { error } = await this.supabase.from("tests").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting test: ${error.message}`);
    }
  }

  private async deleteQuestion(questionId: string) {
    const { error } = await this.supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      throw new Error(`Error deleting question: ${error.message}`);
    }
  }

  async createScore(
    testId: string,
    userId: string,
    submission: TestSubmission,
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
      `,
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
        },
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
          })),
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

  async getAverageTestScoreByUser(userId: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from("tests")
      .select(
        `
        id,
        questions(id, points),
        user_tests!inner (
          score,
          user_id
        )
      `,
      )
      .eq("user_tests.user_id", userId);

    if (error) {
      throw new Error(`Error fetching average test score: ${error.message}`);
    }

    const rows = data || [];
    if (rows.length === 0) return null;

    let totalPercent = 0;
    let counted = 0;

    for (const row of rows) {
      const max = (row.questions || []).reduce(
        (sum: number, q: { points: number }) => sum + (q?.points || 0),
        0,
      );
      const score = row.user_tests?.[0]?.score ?? 0;
      if (max > 0) {
        totalPercent += (score / max) * 100;
        counted += 1;
      }
    }

    if (counted === 0) return null;
    return totalPercent / counted;
  }

  async getRecentTestResults(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResult<RecentUserTestResult>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from("user_tests")
      .select(
        `
        id,
        score,
        created_at,
        updated_at,
        test:tests!user_tests_test_id_fkey (
          id,
          title,
          questions(points)
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Error fetching recent test results: ${error.message}`);
    }

    const results: RecentUserTestResult[] = (data || []).map((row) => {
      const questions = (row as any).test?.questions || [];
      const maxScore = questions.reduce(
        (sum: number, q: { points: number }) => sum + (q?.points || 0),
        0,
      );
      return {
        id: row.id,
        testId: (row as any).test?.id || "",
        title: (row as any).test?.title || "",
        score: row.score || 0,
        maxScore,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return {
      data: results,
      totalRecords: count || 0,
    };
  }

  async getStudentTestResults(testId: string): Promise<StudentTestResult[]> {
    const { data, error } = await this.supabase
      .from("user_tests")
      .select(
        `
        user_id,
        score,
        updated_at,
        user:users!user_tests_user_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        test:tests!user_tests_test_id_fkey (
          id,
          questions(points)
        )
      `,
      )
      .eq("test_id", testId)
      .order("score", { ascending: false });

    if (error) {
      throw new Error(
        `Error fetching student test results: ${error.message}`,
      );
    }

    return (data || []).map((row) => {
      const questions = (row as any).test?.questions || [];
      const maxScore = questions.reduce(
        (sum: number, q: { points: number }) => sum + (q?.points || 0),
        0,
      );
      const score = row.score || 0;
      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      return {
        userId: row.user_id,
        fullName: (row as any).user?.full_name || null,
        avatarUrl: (row as any).user?.avatar_url || null,
        score,
        maxScore,
        percentage,
        completedAt: row.updated_at,
      };
    });
  }
}
