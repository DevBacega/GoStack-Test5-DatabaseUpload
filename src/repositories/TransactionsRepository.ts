import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const initBalance: Balance = { income: 0, outcome: 0, total: 0 };
    const transactions = await this.find();
    const calcBalance = transactions.reduce<Balance>(
      (prevBalance, currentTransaction) => {
        let { income, outcome } = prevBalance;
        if (currentTransaction.type === 'outcome') {
          outcome += currentTransaction.value;
        } else {
          income += currentTransaction.value;
        }
        return { ...prevBalance, outcome, income, total: income - outcome };
      },
      initBalance,
    );
    return calcBalance;
  }
}

export default TransactionsRepository;
