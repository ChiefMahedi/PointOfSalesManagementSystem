import { Customer } from "entities/customer";

export abstract class ICustomerRepository {
    abstract registerCustomer(customerObject: Customer): Promise<boolean>;
    abstract checkUserUniqueness(email: Customer["email"]): Promise<boolean>;
  }
  