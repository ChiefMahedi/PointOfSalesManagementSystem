import { Item } from "../entities/item";
import { Admin } from "../entities/admin";
import { MongoAdminRepository } from "../repositories/adminMongoImp";
import { AdminServices } from "../services/adminService";
import express from "express";
import { MongoItemRepository } from "../repositories/itemMongoRepository";
import { ItemServices } from "../services/itemServices";

const mongoImplementation = new MongoAdminRepository();
const adminService = new AdminServices(mongoImplementation);
const router = express.Router();

const mongoItemImplementation = new MongoItemRepository();
const itemService = new ItemServices(mongoItemImplementation);
//Using these route we can register new admin. For security reasons it's turned off
/* router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    const regDate = req.body.registrationDate;
    const admin = new Admin(
      name,
      email,
      password,
      address,
      phone,
      regDate
    );
    const status = await adminService.registerAdmin(admin );
    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Register an admin");
  }
}); */
router.get("/allitems", async (req, res) => {
  try {
    const admin = await adminService.checkIfAuthorized(req.cookies.posCookie);
    if (admin) {
      const allItems = await itemService.getAllItems();
      res.json(allItems);
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Get any Item");
  }
});

router.get("/item/:category", async (req, res) => {
  try {
    const admin = await adminService.checkIfAuthorized(req.cookies.posCookie);
    if (admin) {
      const category = req.params.category;
      const allItems = await itemService.getItemsByCategory(category);
      res.json(allItems);
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Get any Item");
  }
});

router.get("/item/:name/count", async (req, res) => {
  try {
    const admin = await adminService.checkIfAuthorized(req.cookies.posCookie);
    if (admin) {
      const name = req.params.name;
      // console.log("Name:",name)
      const count = await itemService.getItemsCountByName(name);
      res.json(count);
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Count Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await adminService.adminLogin(email, password);
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

router.post("/item/create", async (req, res) => {
  try {
    const admin = await adminService.checkIfAuthorized(req.cookies.posCookie);
    if (admin) {
      console.log(req.body);
      const itemObject = new Item(
        req.body.name,
        req.body.price,
        req.body.category,
        req.body.category,
        req.body.manufacturer
      );
      const createdItem = await itemService.createAnItem(itemObject);
      res.json(createdItem);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Create Item");
  }
});

export default router;
