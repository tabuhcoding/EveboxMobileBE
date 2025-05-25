import { User } from "../domain/entities/user.entity";
import { Email } from "../domain/value-objects/user/email.vo";
import { UserPinStatusData } from "../queries/get-pin-status/get-pin-status.response.dto";

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  findPinStatusByEmail(email: Email): Promise<UserPinStatusData | null>;
  createPinUser(email: Email, pin: string): Promise<void>;
  updatePinUser(email: Email, pin: string): Promise<void>;
}