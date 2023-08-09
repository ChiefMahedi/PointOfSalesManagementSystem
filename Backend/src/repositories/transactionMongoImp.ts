import { Db, ObjectId } from "mongodb";
import { ITransactionRepository } from "./transactionRepository";
import connectAndInitializeDb from "../mongoDB/connection";
import { Item } from "../entities/item";
import { Transaction } from "../entities/transaction";
import { Customer } from "entities/customer";

export class MongoTransactionRepository implements ITransactionRepository {
  private db: Db | null = null;
  constructor() {
    connectAndInitializeDb().then((initializedDb) => {
      this.db = initializedDb;
    });
  }

  async completeTransaction(customerId: Customer["id"]): Promise<Transaction> {
    const customerCollection = await this.db.collection("customer");
    const itemCollection = await this.db.collection("inventory");
    const customer = await customerCollection.findOne({
      _id: new ObjectId(customerId),
    });
    if (!customer) {
      throw new Error("Customer not found!");
    }
    let totalPrice: number = 0;

    const cartItemIds = customer.cart.map(
      (cartItem) => new ObjectId(cartItem.itemId)
    );
    const cartItems = await itemCollection
      .find({ _id: { $in: cartItemIds } })
      .toArray();
    //For each item find the item price and add all the prices
    for (const cartItem of cartItems) {
      totalPrice += parseFloat(cartItem.price);
    }
    // Converting the fetched documents to instances of my Item class
    const cartItemInfo: Item[] = cartItems.map((itemDoc) => {
      return new Item(
        itemDoc.name,
        itemDoc.quantity,
        itemDoc.price,
        itemDoc.category,
        itemDoc.manufacturer
      );
    });
    const transaction = new Transaction(
      customer.name,
      cartItemInfo,
      new Date(),
      totalPrice,
      customer.phone,
      customer.email,
      customer.address
    );
    const transactionCollection = await this.db.collection("transactions");
    await transactionCollection.insertOne(transaction);
    return transaction;
  }
}
