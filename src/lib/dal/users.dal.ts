import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IUsersDAL } from "../di/interfaces/dal.interfaces";
import {
  UserDetails,
  UpdateProfile,
  UserRole,
} from "@/services/interfaces/service.interfaces";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export class UsersDAL implements IUsersDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getUserDetails(userId: string): Promise<UserDetails | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`Error fetching user details: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const user = data as UserRow;

    const userDetails: UserDetails = {
      id: user.id,
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      username: user.username || "",
      bio: user.bio || "",
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: user.role as UserRole,
    };

    return userDetails;
  }

  async getUserRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`Error fetching user role: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const userRole = data.role as UserRole;
    return userRole;
  }

  async getUserDetailsByUsername(
    username: string
  ): Promise<UserDetails | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      throw new Error(
        `Error fetching user details by username: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    const user = data as UserRow;

    const userDetails: UserDetails = {
      id: user.id,
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      username: user.username || "",
      bio: user.bio || "",
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: user.role as UserRole,
    };

    return userDetails;
  }

  async updateUserDetails(
    userId: string,
    updateData: UpdateProfile
  ): Promise<UserDetails | null> {
    const { data, error } = await this.supabase
      .from("users")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Error updating user details: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const user = data as UserRow;

    const userDetails: UserDetails = {
      id: user.id,
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      username: user.username || "",
      bio: user.bio || "",
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: user.role as UserRole,
    };

    return userDetails;
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    // First, get the current user to check for existing avatar
    const { data: userData, error: userError } = await this.supabase
      .from("users")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    // If there's an existing avatar, delete it from storage
    if (userData?.avatar_url) {
      const existingPath = userData.avatar_url;
      const { error: deleteError } = await this.supabase.storage
        .from("avatars")
        .remove([existingPath]);

      if (deleteError) {
        console.warn(
          `Failed to delete existing avatar: ${deleteError.message}`
        );
      }
    }

    // Upload the new image
    const { data, error } = await this.supabase.storage
      .from("avatars")
      .upload(`${userId}/${file.name}`, file);

    if (error) {
      throw new Error(`Error uploading profile image: ${error.message}`);
    }

    const { error: updateError } = await this.supabase
      .from("users")
      .update({
        avatar_url: data.path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Error updating user avatar: ${updateError.message}`);
    }

    return data.path;
  }

  async getProfileImageBlob(avatarPath: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from("avatars")
      .download(avatarPath);

    if (error) {
      throw new Error(`Error downloading profile image: ${error.message}`);
    }

    if (!data) {
      throw new Error("No image data received");
    }

    return data;
  }

  async removeProfileImage(userId: string): Promise<void> {
    // First, get the current user to check for existing avatar
    const { data: userData, error: userError } = await this.supabase
      .from("users")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    // If there's no avatar, nothing to remove
    if (!userData?.avatar_url) {
      return;
    }

    // Delete the avatar from storage
    const { error: deleteError } = await this.supabase.storage
      .from("avatars")
      .remove([userData.avatar_url]);

    if (deleteError) {
      throw new Error(`Error deleting profile image: ${deleteError.message}`);
    }

    // Update user profile to remove avatar URL
    const { error: updateError } = await this.supabase
      .from("users")
      .update({
        avatar_url: "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Error updating user profile: ${updateError.message}`);
    }
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    // Use the updateUser method instead of admin.updateUserById
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }
}
