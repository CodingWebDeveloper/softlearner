import { ICoursesDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  ICoursesService,
  GetCoursesParams,
  GetCoursesResult,
  BasicCourse,
  GetPurchasedCoursesResult,
  FullCourse,
  CreateCourseParams,
  SimpleCourse,
} from "./interfaces/service.interfaces";

export class CoursesService implements ICoursesService {
  constructor(private coursesDAL: ICoursesDAL) {}

  async createCourse(creatorId: string, params: CreateCourseParams): Promise<SimpleCourse> {
    return this.coursesDAL.createCourse(creatorId, params);
  }

  async getCourses(params: GetCoursesParams): Promise<GetCoursesResult> {
    return this.coursesDAL.getCourses(params);
  }

  async getCourseById(id: string): Promise<BasicCourse | null> {
    return this.coursesDAL.getCourseById(id);
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    return this.coursesDAL.isEnrolled(userId, courseId);
  }

  async getBookmarkedCourses(
    userId: string,
    page: number = 1,
    pageSize: number = 15
  ): Promise<GetCoursesResult> {
    return this.coursesDAL.getBookmarkedCourses(userId, page, pageSize);
  }

  async getPurchasedCourses(
    userId: string,
    page: number = 1,
    pageSize: number = 15
  ): Promise<GetPurchasedCoursesResult> {
    return this.coursesDAL.getPurchasedCourses(userId, page, pageSize);
  }

  async getCourseMaterialsById(
    id: string,
    userId?: string
  ): Promise<FullCourse | null> {
    return this.coursesDAL.getCourseMaterialsById(id, userId);
  }
}
