import { Customer } from "entities/customer";
import { ICustomerRepository } from "./customerRepository";
import connectAndInitializeDb from "../mongoDB/connection";
import { Db, WithId } from "mongodb";
import { Transaction } from "entities/transaction";
import bcrypt from "bcrypt";

export class MongoCustomerRepository implements ICustomerRepository
{
    private db: Db | null = null;
    constructor() {
      connectAndInitializeDb().then((initializedDb) => {
        this.db = initializedDb;
      });
    }
    async registerCustomer(customerObject: Customer): Promise<boolean> {
        let saltrounds = 10;
        const hashedPassword = await bcrypt.hash(customerObject.password, saltrounds);
        let collection = this.db.collection("customer");
        let status = await collection.insertOne(customerObject);
        if(status)
        {
            return true;
        }
        else return false;
    }
    async checkUserUniqueness(email: string): Promise<boolean> {
        let collection = this.db.collection("customer");
        const userExists = await collection.findOne({ email });
        if (userExists) {
          return true;
        }
        return false;
    }
    
}