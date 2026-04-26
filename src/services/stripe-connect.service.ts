import { IStripeConnectDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  IStripeConnectService,
  StripeConnectStatus,
  CreateAccountLinkInput,
} from "./interfaces/service.interfaces";

export class StripeConnectService implements IStripeConnectService {
  constructor(private stripeConnectDAL: IStripeConnectDAL) {}

  async createConnectAccount(userId: string): Promise<string> {
    return this.stripeConnectDAL.createConnectAccount(userId);
  }

  async createAccountLink(input: CreateAccountLinkInput): Promise<string> {
    return this.stripeConnectDAL.createAccountLink(input);
  }

  async getConnectStatus(userId: string): Promise<StripeConnectStatus> {
    return this.stripeConnectDAL.getConnectStatus(userId);
  }

  async getDashboardLink(userId: string): Promise<string> {
    return this.stripeConnectDAL.getDashboardLink(userId);
  }
}
