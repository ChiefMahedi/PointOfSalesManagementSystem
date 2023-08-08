import { Item } from "../entities/item";
import { IItemRepository } from "./itemRepository";
import connectAndInitializeDb from "../mongoDB/connection";
import { Db } from "mongodb";

export class MongoItemRepository implements IItemRepository {
  private db: Db | null = null;
  constructor() {
    connectAndInitializeDb().then((initializedDb) => {
      this.db = initializedDb;
    });
  }
  async getAllItems(): Promise<Item[]> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<Item> {
    throw new Error("Method not implemented.");
  }
  getItemsByCategory(category: string): Promise<Item[]> {
    throw new Error("Method not implemented.");
  }
  getItemsCountByName(name: string): Promise<Item> {
    throw new Error("Method not implemented.");
  }
  async createOneItem(item: Item): Promise<Item> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    // Assuming your Item type has properties like name, quantity, price
    const newItem: Item = {
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      manufacturer: item.manufacturer,
      // ... other properties
    };

    const collection = this.db.collection("inventory");
    await collection.insertOne(newItem);

    return newItem;
  }

  buyItem(id: string) {
    throw new Error("Method not implemented.");
  }
}
