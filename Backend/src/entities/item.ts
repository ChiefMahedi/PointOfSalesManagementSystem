import { Customer } from "./customer";
//Item Entity
export class Item
{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
    sku?: string;
    category : string;
    manufacturer : string;
    manufacturingDate?: Date;
    expiryDate?: Date;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    images?: string[];
    reviews?: {
        rating: number;
        comment: string;
    }[];
    availability?: boolean;
    discounts?: {
        type: string;
        amount: number;
    }[];
    relatedItems?: string[];
    paymentBy?: Customer;
    constructor(name: string, quantity: number, price: number, category: string, manufacturer: string) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.manufacturer = manufacturer;
    }
}