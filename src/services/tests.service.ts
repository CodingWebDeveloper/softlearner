import { ITestsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  ITestsService,
  BasicTest,
  FullTest,
  TestResult,
  TestWithProgress,
  TestSubmission,
} from "./interfaces/service.interfaces";

export class TestsService implements ITestsService {
  constructor(private testsDAL: ITestsDAL) {}

  async getTests(courseId: string): Promise<BasicTest[]> {
    return this.testsDAL.getTests(courseId);
  }

  async getTestById(id: string): Promise<FullTest | null> {
    return this.testsDAL.getTestById(id);
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

    console.log(resultsMap);

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
}
