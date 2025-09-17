import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ITestsDAL } from "../di/interfaces/dal.interfaces";
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
          id,
          text,
          is_correct
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
        updated_at: new Date().toISOString(),
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

  async createTest(
    courseId: string,
    data: CreateTestInput
  ): Promise<BasicTest> {
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

  async saveQuestions(data: QuestionsInput): Promise<FullTest> {
    const { testId, questions } = data;
    console.log("questions", questions);
    try {
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
        }`
      );
    }
  }

  private async createQuestionWithOptions(
    testId: string,
    question: QuestionInput
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
      `
      )
      .eq("id", testId)
      .single();

    if (testError || !testData) {
      throw new Error(
        `Test not found: ${testError?.message || "Test not found"}`
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
      (opt: OptionInput) => opt.status === "NEW"
    );
    if (newOptions.length > 0) {
      const { error: optionsError } = await this.supabase
        .from("answer_options")
        .insert(
          newOptions.map((opt) => ({
            question_id: newQuestion.id,
            text: opt.text,
            is_correct: opt.isCorrect,
          }))
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
      question.options as OptionInput[]
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
