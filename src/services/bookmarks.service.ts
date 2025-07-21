import { IBookmarksDAL } from "@/lib/di/interfaces/dal.interfaces";
import { Bookmark, IBookmarksService } from "./interfaces/service.interfaces";

export class BookmarksService implements IBookmarksService {
  constructor(private bookmarksDAL: IBookmarksDAL) {}

  async createBookmark(userId: string, courseId: string): Promise<Bookmark> {
    return this.bookmarksDAL.createBookmark(userId, courseId);
  }

  async deleteBookmark(userId: string, courseId: string): Promise<void> {
    return this.bookmarksDAL.deleteBookmark(userId, courseId);
  }
}
