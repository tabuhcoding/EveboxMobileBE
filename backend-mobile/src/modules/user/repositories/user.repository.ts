import { User } from "../domain/entities/user.entity";
import { Email } from "../domain/value-objects/user/email.vo";

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}