import { IOrdersDAL } from "@/lib/di/interfaces/dal.interfaces";
import type { SimpleOrder } from "@/lib/di/interfaces/dal.interfaces";

export interface IOrdersService {
  getOrdersByCourseId(courseId: string): Promise<SimpleOrder[]>;
}

export class OrdersService implements IOrdersService {
  constructor(private ordersDAL: IOrdersDAL) {}

  async getOrdersByCourseId(courseId: string): Promise<SimpleOrder[]> {
    return this.ordersDAL.getOrdersByCourseId(courseId);
  }
}
