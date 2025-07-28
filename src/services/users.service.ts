import { IUsersDAL } from "@/lib/di/interfaces/dal.interfaces";
import { IUsersService, UserDetails } from "./interfaces/service.interfaces";

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
}
