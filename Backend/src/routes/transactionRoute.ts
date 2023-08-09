import express from "express";
import { TransactionService } from "../services/transactionService";

import { MongoTransactionRepository } from "../repositories/transactionMongoImp";
const router = express.Router();

const transactionMongoRepo = new MongoTransactionRepository();
const transactionService = new TransactionService(transactionMongoRepo)

router.post("/:customerId", async (req, res) => {
   try {
    const customerId = req.params.customerId;
    const transaction = await transactionService.completeTransaction(customerId);
    res.json(transaction);
   } catch (error) {
    console.log(error);
    res.status(500).send("Transaction failed");
   }
});

export default router;
