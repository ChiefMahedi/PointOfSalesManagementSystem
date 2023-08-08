
import { Item } from "../entities/item";
import { IItemRepository } from "../repositories/itemRepository";

export class ItemServices {
  private dataServices: IItemRepository;
  constructor(dataServices: IItemRepository) {
    this.dataServices = dataServices;
  }
  async createAnItem(itemObject: Item): Promise<Item>  {
    try {
      const item = await this.dataServices.createOneItem(itemObject);
      return item;
    } catch (error) {
      throw new Error("Error creating item in the database");
    }
  }
}
