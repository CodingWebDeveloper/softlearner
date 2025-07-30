import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ICreatorApplicationsDAL } from "../di/interfaces/dal.interfaces";
import {
  CreatorApplication,
  CreateCreatorApplicationInput,
  UpdateCreatorApplicationInput,
  GetCreatorApplicationsParams,
  GetCreatorApplicationsResult,
  ApplicationLog,
} from "@/services/interfaces/service.interfaces";

type CreatorApplicationWithUser =
  Database["public"]["Tables"]["creator_applications"]["Row"] & {
    user: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  };

export class CreatorApplicationsDAL implements ICreatorApplicationsDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createApplication(
    userId: string,
    input: CreateCreatorApplicationInput
  ): Promise<CreatorApplication> {
    const { data, error } = await this.supabase
      .from("creator_applications")
      .insert({
        user_id: userId,
        bio: input.bio,
        content_type: input.content_type,
        portfolio_links: input.portfolio_links,
        experience_level: input.experience_level,
        motivation: input.motivation,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating application: ${error.message}`);
    }

    return data as CreatorApplication;
  }

  async getUserApplication(userId: string): Promise<CreatorApplication | null> {
    const { data, error } = await this.supabase
      .from("creator_applications")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching user application: ${error.message}`);
    }

    return data as CreatorApplication | null;
  }

  async getApplications(
    params: GetCreatorApplicationsParams
  ): Promise<GetCreatorApplicationsResult> {
    const { page = 1, pageSize = 15, status, search } = params;

    let query = this.supabase.from("creator_applications").select(
      `*,
        user:user_id(
          id,
          full_name,
          avatar_url
        )`,
      { count: "exact" }
    );

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `bio.ilike.%${search}%,content_type.ilike.%${search}%,motivation.ilike.%${search}%`
      );
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get paginated results
    const { data, error, count } = await query
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching applications: ${error.message}`);
    }

    const transformedData = (data as CreatorApplicationWithUser[] | null)?.map(
      (application) => ({
        id: application.id,
        user_id: application.user_id,
        bio: application.bio,
        content_type: application.content_type,
        portfolio_links: application.portfolio_links,
        experience_level: application.experience_level,
        motivation: application.motivation,
        status: application.status,
        admin_notes: application.admin_notes,
        reviewed_by: application.reviewed_by,
        reviewed_at: application.reviewed_at,
        created_at: application.created_at,
        updated_at: application.updated_at,
      })
    );

    return {
      data: transformedData || [],
      totalRecords: count || 0,
    };
  }

  async getApplicationById(id: string): Promise<CreatorApplication | null> {
    const { data, error } = await this.supabase
      .from("creator_applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching application: ${error.message}`);
    }

    return data as CreatorApplication | null;
  }

  async updateApplicationStatus(
    id: string,
    adminId: string,
    input: UpdateCreatorApplicationInput
  ): Promise<CreatorApplication> {
    const updateData: any = {
      status: input.status,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    };

    if (input.admin_notes) {
      updateData.admin_notes = input.admin_notes;
    }

    const { data, error } = await this.supabase
      .from("creator_applications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }

    return data as CreatorApplication;
  }

  async logApplicationAction(
    applicationId: string,
    adminId: string,
    action: string,
    notes?: string
  ): Promise<ApplicationLog> {
    const { data, error } = await this.supabase
      .from("application_logs")
      .insert({
        application_id: applicationId,
        admin_id: adminId,
        action,
        notes,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error logging application action: ${error.message}`);
    }

    return data as ApplicationLog;
  }

  async getApplicationLogs(applicationId: string): Promise<ApplicationLog[]> {
    const { data, error } = await this.supabase
      .from("application_logs")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching application logs: ${error.message}`);
    }

    return data as ApplicationLog[];
  }
}
