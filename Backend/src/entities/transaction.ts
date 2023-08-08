import { Customer } from "./customer";
import { Item } from "./item";

export class Transaction {
    transactionId: string;
    customer: Customer;
    items: Item[];
    transactionDate: Date;
    totalAmount: number;
    customerPhone: Customer["phone"];
    customerEmail : Customer["email"];
    customerAddress: Customer["address"];
    constructor(
        transactionId: string,
        customer: Customer,
        items: Item[],
        transactionDate: Date,
        totalAmount: number,
        customerPhone: Customer["phone"],
        customerEmail : Customer["email"],
        customerAddress: Customer["address"]
    ) {
        this.transactionId = transactionId;
        this.customer = customer;
        this.items = items;
        this.transactionDate = transactionDate;
        this.totalAmount = totalAmount;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
    }
}