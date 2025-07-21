import { IPaymentsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  IPaymentsService,
  CreateCheckoutSessionInput,
  CheckoutSessionResponse,
} from "./interfaces/service.interfaces";

export class PaymentsService implements IPaymentsService {
  constructor(private paymentsDAL: IPaymentsDAL) {}

  public async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSessionResponse> {
    return this.paymentsDAL.createCheckoutSession(input);
  }
}
