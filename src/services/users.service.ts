import { IUsersDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  IUsersService,
  UserDetails,
  UpdateProfile,
} from "./interfaces/service.interfaces";

export class UsersService implements IUsersService {
  constructor(private usersDAL: IUsersDAL) {}

  async getUserDetails(userId: string): Promise<UserDetails | null> {
    return this.usersDAL.getUserDetails(userId);
  }

  async getUserDetailsByUsername(
    username: string
  ): Promise<UserDetails | null> {
    return this.usersDAL.getUserDetailsByUsername(username);
  }

  async updateUserDetails(
    userId: string,
    updateData: UpdateProfile
  ): Promise<UserDetails | null> {
    return this.usersDAL.updateUserDetails(userId, updateData);
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    return this.usersDAL.uploadProfileImage(userId, file);
  }

  async getProfileImageBlob(avatarPath: string): Promise<Blob> {
    return this.usersDAL.getProfileImageBlob(avatarPath);
  }

  async removeProfileImage(userId: string): Promise<void> {
    return this.usersDAL.removeProfileImage(userId);
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    return this.usersDAL.changePassword(userId, newPassword);
  }
}
