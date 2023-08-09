import { Transaction } from "../entities/transaction";
import { ITransactionRepository } from "../repositories/transactionRepository";

export class TransactionService
{
    private dataServices: ITransactionRepository;
    constructor(dataServices: ITransactionRepository) {
      this.dataServices = dataServices;
    }
    async completeTransaction( customerId: string): Promise<Transaction> {
        try {
          const transaction = await this.dataServices.completeTransaction(customerId);
          return transaction;
        } catch (error) {
          throw new Error("Error creating item in the database");
        }
      }
}