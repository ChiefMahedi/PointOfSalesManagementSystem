import { Item } from "../entities/item";
export abstract class IItemRepository
{
    abstract getAllItems(): Promise<Item[]>;
    abstract get(id: string): Promise<Item>;
    abstract getItemsByCategory(category: string):  Promise<Item[]>;
    abstract getItemsCountByName(name: string): Promise <Item>;
    abstract createOneItem (item: Item): Promise<Item>;
    abstract buyItem(id: string);
}