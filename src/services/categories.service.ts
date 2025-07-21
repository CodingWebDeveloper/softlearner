import { ICategoriesDAL } from "@/lib/di/interfaces/dal.interfaces";
import { ICategoriesService } from "./interfaces/service.interfaces";
import { Category } from "@/lib/database/database.types";

export class CategoriesService implements ICategoriesService {
  constructor(private categoriesDAL: ICategoriesDAL) {}

  async getCategories(): Promise<Category[]> {
    return this.categoriesDAL.getCategories();
  }
}
