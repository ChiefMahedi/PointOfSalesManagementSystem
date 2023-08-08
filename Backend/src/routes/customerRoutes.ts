import { Customer } from "../entities/customer";
import { MongoCustomerRepository } from "../repositories/customerMongoImp";
import { CustomerServices } from "../services/customerService";
import express from 'express';

const mongoImplementation = new MongoCustomerRepository();
const customerService = new CustomerServices(mongoImplementation);
const router = express.Router()
router.post('/register', async (req, res)=>{
  try {
    const userExists = await customerService.checkUserUniqueness(req.body.email);
    if(userExists){
        throw new Error("User already Exists!");
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    const regDate = req.body.registrationDate;
    const customer = new Customer(name, email, password, address, phone, regDate)
    const status = await customerService.registerCustomer(customer);
    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Register Customer");
  }
})
export default router;