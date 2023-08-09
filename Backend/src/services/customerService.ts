import { Item } from "entities/item";
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
  async checkUserUniqueness(email: Customer["email"]): Promise<boolean> {
    try {
      const status = await this.dataServices.checkUserUniqueness(email);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("User already exists");
    }
  }
  async customerLogin(email: Customer["email"], password: Customer["password"])
  {
    try {
      const token= await this.dataServices.customerLogin(email, password);
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
  async addToCart(itemId: Item["id"], customerId: Customer["id"]): Promise<boolean>
  {
    try {
      const status= await this.dataServices.addToCart(itemId, customerId);
      return status;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add item in the cart");
    }
  }
  async makePayment(customerId: Customer["id"]): Promise<any>
  {
    try {
      const gurl= await this.dataServices.makePayment(customerId);
      return  gurl;
    } catch (error) {
      console.log(error);
      throw new Error("Payment Error");
    }
  }

}
