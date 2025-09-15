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
  PaginatedResult,
} from "./interfaces/service.interfaces";

export class CoursesService implements ICoursesService {
  constructor(private coursesDAL: ICoursesDAL) {}

  async createCourse(
    creatorId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse> {
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

  async getCoursesByCreator(
    creatorId: string,
    page: number = 1,
    pageSize: number = 15,
    sortBy?: "name" | "category" | "price" | "created_at" | "updated_at",
    sortDir?: "asc" | "desc"
  ): Promise<PaginatedResult<SimpleCourse>> {
    return this.coursesDAL.getCoursesByCreator(
      creatorId,
      page,
      pageSize,
      sortBy,
      sortDir
    );
  }

  async updateCourse(
    creatorId: string,
    courseId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse> {
    return this.coursesDAL.updateCourse(creatorId, courseId, params);
  }

  async deleteCourse(creatorId: string, courseId: string): Promise<void> {
    return this.coursesDAL.deleteCourse(creatorId, courseId);
  }

  async getCourseDataById(id: string): Promise<SimpleCourse | null> {
    return this.coursesDAL.getCourseDataById(id);
  }

  async getThumbnail(thumbnailPath: string): Promise<Blob> {
    return this.coursesDAL.getThumbnail(thumbnailPath);
  }
}
