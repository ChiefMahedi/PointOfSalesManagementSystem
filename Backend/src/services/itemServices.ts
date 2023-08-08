import { Item } from "../entities/item";
import { IItemRepository } from "../repositories/itemRepository";

export class ItemServices {
  private dataServices: IItemRepository;
  constructor(dataServices: IItemRepository) {
    this.dataServices = dataServices;
  }
  async createAnItem(itemObject: Item): Promise<Item> {
    try {
      const item = await this.dataServices.createOneItem(itemObject);
      return item;
    } catch (error) {
      throw new Error("Error creating item in the database");
    }
  }
  async getAllItems(): Promise<Item[]> {
    try {
      const items = await this.dataServices.getAllItems();
      return items;
    } catch (error) {
      throw new Error("Error getting all items from the database");
    }
  }
  async getItemsByCategory(category: string): Promise<Item[]> {
    try {
      const items = await this.dataServices.getItemsByCategory(category);
      return items;
    } catch (error) {
      throw new Error("Error getting items from the database");
    }
  }
  async getItemsCountByName(name: string) : Promise<number>{
    try {
      const count = await this.dataServices.getItemsCountByName(name);
      return count;
    } catch (error) {
      throw new Error("Error getting item count from the database");
    }
  }
  async buyItem(itemId: string) {
    try {
      const transactionDetails = await this.dataServices.buyItem(itemId);
      return transactionDetails;
    } catch (error) {
      console.log(error);
      throw new Error("Error buying item");
    }
  }
}
