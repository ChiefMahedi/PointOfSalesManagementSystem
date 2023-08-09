import { Db, MongoClient} from "mongodb";
import dotenv from 'dotenv';
import path from 'path';
//Path for connection string
dotenv.config({path: path.resolve('../Backend','.env')});
//console.log(path.resolve('../Backend','.env'))

const connectionString = process.env.mongoURI || "";
const client = new MongoClient(connectionString);

async function connectAndInitializeDb(): Promise<Db> {
    try {
        const con = await client.connect();
        if (con) {
            console.log("Connected to the database");
            //Return the Point Of Sale Database
            return con.db("PointOfSale");
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

export default connectAndInitializeDb;