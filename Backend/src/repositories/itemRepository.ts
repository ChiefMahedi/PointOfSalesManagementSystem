import { Item } from "../entities/item";
import { Transaction } from "entities/transaction";
export abstract class IItemRepository
{
    abstract getAllItems(): Promise<Item[]>;
    abstract get(id: string): Promise<Item>;
    abstract getItemsByCategory(category: string):  Promise<Item[]>;
    abstract getItemsCountByName(name: string): Promise<number>;
    abstract createOneItem (item: Item): Promise<Item>;
    abstract buyItem(id: string): Promise<Transaction>;
}