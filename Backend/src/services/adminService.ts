import { Admin } from "../entities/admin";
import { IAdminRepository } from "../repositories/adminRepository";

export class AdminServices {
  private dataServices: IAdminRepository;
  constructor(dataServices: IAdminRepository) {
    this.dataServices = dataServices;
  }
  async registerAdmin(adminObject: Admin) {
    try {
      const status = await this.dataServices.registerAdmin(adminObject);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("Can't register customer");
    }
  }
  async adminLogin(email: Admin["email"], password: Admin["password"])
  {
    try {
      const token= await this.dataServices.adminLogin(email, password);
      return token;
    } catch (error) {
      console.log(error);
      throw new Error("Login Failed");
    }
  }
  async checkIfAuthorized(cookie: any): Promise<any>
  {
    try {
      const status= await this.dataServices.checkIfAuthorized(cookie);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("Not Authorized");
    }
  }

}
