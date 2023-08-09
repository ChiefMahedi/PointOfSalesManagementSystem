import { MongoItemRepository } from "../repositories/itemMongoRepository";
import { Customer } from "../entities/customer";
import { MongoCustomerRepository } from "../repositories/customerMongoImp";
import { CustomerServices } from "../services/customerService";
import express from "express";
import { ItemServices } from "../services/itemServices";

const mongoImplementation = new MongoCustomerRepository();
const customerService = new CustomerServices(mongoImplementation);

const mongoItemImplementation = new MongoItemRepository();
const itemService = new ItemServices(mongoItemImplementation);


const router = express.Router();



router.get("/allitems", async (req, res) => {
  try {
    const customer = await customerService.checkIfAuthorized(req.cookies.posCookie);
    if(customer)
    {
      const allItems = await itemService.getAllItems();
      res.json(allItems);
    }
    else
    {
      throw new Error("Not authorized")
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Get any Item");
  }
});

router.get("/item/:category", async (req, res) => {
  try {
    const customer = await customerService.checkIfAuthorized(req.cookies.posCookie);
    if(customer)
    {
      const category = req.params.category;
      const allItems = await itemService.getItemsByCategory(category);
      res.json(allItems);
    }
    else
    {
      throw new Error("Not authorized")
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Get any Item");
  }
});

router.get("/item/:name/count", async (req, res) => {
  try {
    const customer = await customerService.checkIfAuthorized(req.cookies.posCookie);
    if(customer)
    {
      const name= req.params.name;
     // console.log("Name:",name)
      const count = await itemService.getItemsCountByName(name);
      res.json(count);
    }
    else
    {
      throw new Error("Not authorized")
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Count Error");
  }
});

router.post("/register", async (req, res) => {
  try {
    const userExists = await customerService.checkUserUniqueness(
      req.body.email
    );
    if (userExists) {
      throw new Error("User already Exists!");
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    const regDate = req.body.registrationDate;
    const customer = new Customer(
      name,
      email,
      password,
      address,
      phone,
      regDate
    );
    const status = await customerService.registerCustomer(customer);
    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Register Customer");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await customerService.customerLogin(email, password);
    res.cookie("posCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json("Login Success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Log In");
  }
});

router.post("/addtoCart/:itemId", async (req, res) => {
  try {
    const customer = await customerService.checkIfAuthorized(
      req.cookies.posCookie
    );
    if (customer) {
      const itemId = req.params.itemId;
      const customerId = customer._id;
      const cartStatus = await customerService.addToCart(itemId, customerId);
      if (cartStatus) {
        res.json("Added to cart");
      } else {
        throw new Error("Add to cart failed");
      }
    }
    else res.json("Not authorized");
  } catch (error) {
    console.log(error);
    res.status(500).send("Add to cart failed");
  }
});

router.get('/payment', async (req, res)=>{
  try {
    const customer = await customerService.checkIfAuthorized(
      req.cookies.posCookie
    );
    if(customer)
    {
      const  gurl = await customerService.makePayment(customer._id);
      if ( gurl) {
        console.log("redirecting to>>>>",gurl)
        res.redirect(gurl);
      } else {
        throw new Error("Payment failed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Payment Failed");
  }
})


export default router;
