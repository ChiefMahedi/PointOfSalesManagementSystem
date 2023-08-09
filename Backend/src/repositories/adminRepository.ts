import { Admin } from "../entities/admin";

export abstract class IAdminRepository {
  abstract registerAdmin(adminObject: Admin): Promise<boolean>;
  //abstract checkUserUniqueness(email: Admin["email"]): Promise<boolean>;
  abstract adminLogin(
    email: Admin["email"],
    password: Admin["password"]
  ): Promise<string>;
  abstract checkIfAuthorized(cookie: string): Promise<any>;
}