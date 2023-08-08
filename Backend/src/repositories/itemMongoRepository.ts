import { Item } from "../entities/item";
import { IItemRepository } from "./itemRepository";
import connectAndInitializeDb from "../mongoDB/connection";
import { Db, WithId } from "mongodb";
import { Transaction } from "entities/transaction";

export class MongoItemRepository implements IItemRepository {
  private db: Db | null = null;
  constructor() {
    connectAndInitializeDb().then((initializedDb) => {
      this.db = initializedDb;
    });
  }

  async getAllItems(): Promise<Item[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    let collection = this.db.collection("inventory");
    let result = await collection.find().toArray();
    const items: Item[] = result.map((doc: WithId<Document>) => {
      const itemData: any = doc; 
      return itemData;
    });
    return items;
  }

 async get(id: string): Promise<Item> {
    throw new Error("Method not implemented.");
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const collection = this.db.collection("inventory");
    const result = await collection.find({ category }).toArray();
    const items: Item[] = result.map((doc: WithId<Document>) => {
      const itemData: any = doc; 
      return itemData;
    });
    return items;
  }

  async getItemsCountByName(name: string): Promise<number> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const collection = this.db.collection("inventory");
    const count = await collection.countDocuments({ name });
    return count;
  }

  async createOneItem(item: Item): Promise<Item> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
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

  buyItem(id: string): Promise<Transaction> {
    throw new Error("Method not implemented.");
  }
}
