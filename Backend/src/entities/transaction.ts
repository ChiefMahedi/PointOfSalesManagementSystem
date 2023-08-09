import { Customer } from "./customer";
import { Item } from "./item";
//Transaction Entity
export class Transaction {
    id?: string;
    customerName: Customer["name"];
    items: Item[];
    transactionDate: Date;
    totalAmount: number;
    customerPhone: Customer["phone"];
    customerEmail : Customer["email"];
    customerAddress: Customer["address"];
    constructor(
        customer: Customer["name"],
        items: Item[],
        transactionDate: Date,
        totalAmount: number,
        customerPhone: Customer["phone"],
        customerEmail : Customer["email"],
        customerAddress: Customer["address"]
    ) {
        this.customerName = customer;
        this.items = items;
        this.transactionDate = transactionDate;
        this.totalAmount = totalAmount;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
    }
}