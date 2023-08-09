import { Customer } from "entities/customer";
import { Item } from "entities/item";

export abstract class ICustomerRepository {
  abstract registerCustomer(customerObject: Customer): Promise<boolean>;
  abstract checkUserUniqueness(email: Customer["email"]): Promise<boolean>;
  abstract customerLogin(
    email: Customer["email"],
    password: Customer["password"]
  ): Promise<string>;
  abstract checkIfAuthorized(cookie: string): Promise<any>;
  abstract addToCart(
    itemId: Item["id"],
    customerId: Customer["id"]
  ): Promise<boolean>;
  abstract makePayment(customerId: Customer["id"]): Promise<any>;
}
