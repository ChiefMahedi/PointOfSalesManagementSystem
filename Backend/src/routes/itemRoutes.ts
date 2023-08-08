import express from "express";
import { MongoItemRepository } from "../repositories/itemMongoRepository";
import { ItemServices } from "../services/itemServices";
import { Item } from "../entities/item";

const router = express.Router();
const mongoImplementation = new MongoItemRepository();
const itemService = new ItemServices(mongoImplementation);

router.post("/create", async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).send("Couldn't Create Item");
  }
});
export default router;