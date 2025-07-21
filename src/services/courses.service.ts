import { ICoursesDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  ICoursesService,
  GetCoursesParams,
  GetCoursesResult,
  BasicCourse,
} from "./interfaces/service.interfaces";

export class CoursesService implements ICoursesService {
  constructor(private coursesDAL: ICoursesDAL) {}

  async getCourses(params: GetCoursesParams): Promise<GetCoursesResult> {
    return this.coursesDAL.getCourses(params);
  }

  async getCourseById(id: string): Promise<BasicCourse | null> {
    return this.coursesDAL.getCourseById(id);
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    return this.coursesDAL.isEnrolled(userId, courseId);
  }
}
