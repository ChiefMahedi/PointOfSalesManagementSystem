//Entities
import { Customer } from "entities/customer";
import { Item } from "entities/item";
import { Transaction } from "entities/transaction";
//
//Repositories
import { ICustomerRepository } from "./customerRepository";
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

//For payment- I am using SSLCommerz
import SSLCommerzPayment from "sslcommerz-lts";
//
dotenv.config({ path: path.resolve("../Backend", ".env") });
//console.log(path.resolve("../Backend", ".env"));

//SSLcommerz Store Information
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false; //true for live, false for sandbox

//MongoDB implementation of ICustomerRepository
export class MongoCustomerRepository implements ICustomerRepository {
  //Database object
  private db: Db | null = null;
  //Initialize the database object
  constructor() {
    connectAndInitializeDb().then((initializedDb) => {
      this.db = initializedDb;
    });
  }
  //For completing payment for the items in the cart
  async makePayment(customerId: Customer["id"]): Promise<any> {
    //Connect to the customer collection
    const customerCollection = this.db.collection("customer");

    // Get the cart items for the customer
    //First check if customer exists
    const customer = await customerCollection.findOne({
      _id: new ObjectId(customerId),
    });
    if (!customer) {
      console.log("Customer not found.");
      return false;
    }
    //Then map the cart items to Item id(s) to an array
    const cartItemIds = customer.cart.map(
      (cartItem) => new ObjectId(cartItem.itemId)
    );

    // Look up the item prices and calculate the total price
    //First connect to the inventory collection
    const itemsCollection = this.db.collection("inventory");
    //For each item ids find the Item from the inventory collection
    const cartItemsWithPrices = await itemsCollection
      .find({ _id: { $in: cartItemIds } })
      .toArray();
    //Calculate the total price
    let totalPrice: number = 0;
    //For each item find the item price and add all the prices
    for (const cartItem of cartItemsWithPrices) {
      totalPrice += parseFloat(cartItem.price);
    }

    const transActionId = new ObjectId().toString();
    //SSLcommerz data
    const data = {
      total_amount: totalPrice,
      currency: "BDT",
      tran_id: transActionId, // use unique tran_id for each api call
      success_url: `http://localhost:5000/transaction/${customer._id}`,
      fail_url: "http://localhost:3030/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:5000/payment/validate-ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: customer.name,
      cus_email: customer.email,
      cus_add1: customer.address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const init = await sslcz.init(data);
    const gurl = await init.GatewayPageURL;
    //Returns the gateway URL for sslcommerz
    return gurl;
  }


  //For adding Items to cart
  async addToCart( itemId: Item["id"], customerId: Customer["id"]): Promise<boolean> {

    const customerCollection = this.db.collection("customer");
    // Check if the item with itemId already exists in the customer's cart
    const customer = await customerCollection.findOne({
      _id: new ObjectId(customerId),
    });
    if (!customer) {
      console.log("Customer not found.");
      return false;
    }

    if (customer.cart && customer.cart.some((item) => item.itemId === itemId)) {
      console.log("Item already exists in cart.");
      return false;
    }
    const updateResult = await customerCollection.updateOne(
      { _id: new ObjectId(customerId) },
      { $push: { cart: { itemId } } }
    );
    if (updateResult) return true;
    else return false;
  }


  //To check if an customer is authorized or not
  async checkIfAuthorized(cookie: string): Promise<any> {
    // Verify the JWT token using the JWT_SECRET
    const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
    //console.log(cookie);
    //console.log(decoded);
    // Find the user in the 'customer' collection based on the decoded customerID from the JWT
    const customer = await this.db.collection("customer").findOne(
      { _id: new ObjectId(decoded.customerID) },
      { projection: { password: 0 } } // Excluding the 'password' field from the result
    );

    if (!customer) {
      throw new Error("Not authorized, token failed");
    }

    return customer;
  }


  //For completing the login
  async customerLogin( email: Customer["email"], password: Customer["password"]): Promise<string> {
    const customer = await this.db.collection("customer").findOne({ email });
    //Check if customer with this email exists and the provided password is correct or not
    if (customer && (await bcrypt.compare(password, customer.password))) {
      //If the given information is correct create a token and return it to send as cookie
      const token = jwt.sign(
        { customerID: customer._id },
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

  //For registering a new customer
  async registerCustomer(customerObject: Customer): Promise<boolean> {
    let saltrounds = 10;
    //Hash the password
    customerObject.password = await bcrypt.hash(
      customerObject.password,
      saltrounds
    );
    let collection = this.db.collection("customer");
    let status = await collection.insertOne(customerObject);
    if (status) {
      return true;
    } else return false;
  }

  //To check if a customer has unique email or not during registration
  async checkUserUniqueness(email: Customer["email"]): Promise<boolean> {
    let collection = this.db.collection("customer");
    const userExists = await collection.findOne({ email });
    if (userExists) {
      return true;
    }
    return false;
  }
}
