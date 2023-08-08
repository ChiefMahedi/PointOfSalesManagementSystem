import { Customer } from "../entities/customer";
import { ICustomerRepository } from "../repositories/customerRepository";

export class CustomerServices {
  private dataServices: ICustomerRepository;
  constructor(dataServices: ICustomerRepository) {
    this.dataServices = dataServices;
  }
  async registerCustomer(customerObject: Customer) {
    try {
      const status = await this.dataServices.registerCustomer(customerObject);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("Can't register customer");
    }
  }
  async checkUserUniqueness(email: Customer["email"]) {
    try {
      const status = await this.dataServices.checkUserUniqueness(email);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("User already exists");
    }
  }
}
