import { MongoClient} from "mongodb";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve('../Backend','.env')});
console.log(path.resolve('../Backend','.env'))
const connectionString = process.env.mongoURI || "";
const client = new MongoClient(connectionString);

async function connectAndInitializeDb() {
    try {
        const con = await client.connect();
        if (con) {
            console.log("Connected to the database");
            return con.db("PointOfSale");
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

export default connectAndInitializeDb;