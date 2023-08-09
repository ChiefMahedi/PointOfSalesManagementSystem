import { Customer } from "../entities/customer";
import { Transaction } from "../entities/transaction";

export abstract class ITransactionRepository
{
    abstract completeTransaction(customerId: Customer["id"]): Promise<Transaction>;
}