import { ITestsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  ITestsService,
  BasicTest,
  CreateTestInput,
  FullTest,
  FullQuestion,
  QuestionsInput,
  TestResult,
  TestWithProgress,
  TestSubmission,
  PaginatedResult,
  RecentUserTestResult,
  StudentTestResult,
} from "./interfaces/service.interfaces";

export class TestsService implements ITestsService {
  constructor(private testsDAL: ITestsDAL) {}

  async getTests(courseId: string): Promise<BasicTest[]> {
    return this.testsDAL.getTests(courseId);
  }

  async getTestById(id: string): Promise<FullTest | null> {
    return this.testsDAL.getTestById(id);
  }

  async getTestQuestions(testId: string): Promise<FullQuestion[]> {
    return this.testsDAL.getTestQuestions(testId);
  }

  async updateTest(id: string, data: CreateTestInput): Promise<BasicTest> {
    return this.testsDAL.updateTest(id, data);
  }

  async deleteTest(id: string): Promise<void> {
    return this.testsDAL.deleteTest(id);
  }

  async saveQuestions(data: QuestionsInput): Promise<FullTest> {
    return this.testsDAL.saveQuestions(data);
  }

  async createTest(
    courseId: string,
    data: CreateTestInput
  ): Promise<BasicTest> {
    return this.testsDAL.createTest(courseId, data);
  }

  async getTestResults(
    courseId: string,
    userId: string
  ): Promise<TestResult[]> {
    return this.testsDAL.getTestResults(courseId, userId);
  }

  async createScore(
    testId: string,
    userId: string,
    submission: TestSubmission
  ): Promise<TestResult> {
    return this.testsDAL.createScore(testId, userId, submission);
  }

  async getTestMaterials(
    courseId: string,
    userId: string
  ): Promise<TestWithProgress[]> {
    const [tests, results] = await Promise.all([
      this.getTests(courseId),
      this.getTestResults(courseId, userId),
    ]);

    const resultsMap = new Map(
      results.map((result) => [
        result.testId,
        { score: result.score, maxScore: result.maxScore },
      ])
    );

    return tests.map((test) => {
      const result = resultsMap.get(test.id);
      const progress =
        result && result.maxScore > 0
          ? Math.round((result.score / result.maxScore) * 100)
          : 0;

      return {
        ...test,
        progress,
      };
    });
  }

  async getAverageTestScoreByUser(userId: string): Promise<number | null> {
    return this.testsDAL.getAverageTestScoreByUser(userId);
  }

  async getRecentTestResults(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<RecentUserTestResult>> {
    return this.testsDAL.getRecentTestResults(userId, page, pageSize);
  }

  async getStudentTestResults(testId: string): Promise<StudentTestResult[]> {
    return this.testsDAL.getStudentTestResults(testId);
  }
}
