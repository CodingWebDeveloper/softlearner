import { ICreatorApplicationsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  ICreatorApplicationsService,
  CreateCreatorApplicationInput,
  UpdateCreatorApplicationInput,
  GetCreatorApplicationsParams,
  GetCreatorApplicationsResult,
  CreatorApplication,
  ApplicationLog,
} from "./interfaces/service.interfaces";

export class CreatorApplicationsService implements ICreatorApplicationsService {
  constructor(private creatorApplicationsDAL: ICreatorApplicationsDAL) {}

  async createApplication(
    userId: string,
    input: CreateCreatorApplicationInput
  ): Promise<CreatorApplication> {
    // Check if user already has an application
    const existingApplication =
      await this.creatorApplicationsDAL.getUserApplication(userId);

    if (existingApplication) {
      throw new Error("User already has a creator application submitted");
    }

    return this.creatorApplicationsDAL.createApplication(userId, input);
  }

  async getUserApplication(userId: string): Promise<CreatorApplication | null> {
    return this.creatorApplicationsDAL.getUserApplication(userId);
  }

  async getApplications(
    params: GetCreatorApplicationsParams
  ): Promise<GetCreatorApplicationsResult> {
    return this.creatorApplicationsDAL.getApplications(params);
  }

  async getApplicationById(id: string): Promise<CreatorApplication | null> {
    return this.creatorApplicationsDAL.getApplicationById(id);
  }

  async updateApplicationStatus(
    id: string,
    adminId: string,
    input: UpdateCreatorApplicationInput
  ): Promise<CreatorApplication> {
    // Get the application to validate it exists
    const application = await this.creatorApplicationsDAL.getApplicationById(
      id
    );

    if (!application) {
      throw new Error("Application not found");
    }

    // Update the application status
    const updatedApplication =
      await this.creatorApplicationsDAL.updateApplicationStatus(
        id,
        adminId,
        input
      );

    // Log the admin action
    const action =
      input.status === "approved"
        ? "Application Approved"
        : "Application Rejected";
    const notes = input.admin_notes || `Application ${input.status} by admin`;

    await this.creatorApplicationsDAL.logApplicationAction(
      id,
      adminId,
      action,
      notes
    );

    return updatedApplication;
  }

  async logApplicationAction(
    applicationId: string,
    adminId: string,
    action: string,
    notes?: string
  ): Promise<ApplicationLog> {
    return this.creatorApplicationsDAL.logApplicationAction(
      applicationId,
      adminId,
      action,
      notes
    );
  }

  async getApplicationLogs(applicationId: string): Promise<ApplicationLog[]> {
    return this.creatorApplicationsDAL.getApplicationLogs(applicationId);
  }
}
