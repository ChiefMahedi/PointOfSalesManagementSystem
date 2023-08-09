//Entities
import { Admin } from "../entities/admin";
//
//Connection for MongoDB
import connectAndInitializeDb from "../mongoDB/connection";
//
//MongoDB related Classes
import { Db, WithId, ObjectId } from "mongodb";
//
//For hashing password
import bcrypt from "bcrypt";
//
//For creating tokens
import jwt from "jsonwebtoken";
//
import dotenv from "dotenv";
import path from "path";
import { IAdminRepository } from "./adminRepository";

//MongoDB implementation of ICustomerRepository
export class MongoAdminRepository implements IAdminRepository {
  //Database object
  private db: Db | null = null;
  //Initialize the database object
  constructor() {
    connectAndInitializeDb().then((initializedDb) => {
      this.db = initializedDb;
    });
  }
    async registerAdmin(adminObject: Admin): Promise<boolean> {
        let saltrounds = 10;
        //Hash the password
        adminObject.password = await bcrypt.hash(
          adminObject.password,
          saltrounds
        );
        let collection = this.db.collection("admin");
        let status = await collection.insertOne(adminObject);
        if (status) {
          return true;
        } else return false;
    }
  async checkIfAuthorized(cookie: string): Promise<boolean> {
    // Verify the JWT token using the JWT_SECRET
    const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
    //console.log(cookie);
    //console.log(decoded);
    const admin = await this.db.collection("admin").findOne(
      { _id: new ObjectId(decoded.adminID) },
      { projection: { password: 0 } } // Excluding the 'password' field from the result
    );

    if (!admin) {
      return false
    }

    return true;
  }
  async adminLogin(email: Admin["email"], password: string): Promise<string> {
    const admin = await this.db.collection("admin").findOne({ email });
    //Check if customer with this email exists and the provided password is correct or not
    if (admin && (await bcrypt.compare(password, admin.password))) {
      //If the given information is correct create a token and return it to send as cookie
      const token = jwt.sign(
        { adminID: admin._id },
        process.env.SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      return token;
    } else {
      throw new Error("Invalid email or password");
    }
  }
}
