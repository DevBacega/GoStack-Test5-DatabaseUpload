import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (type !== 'outcome' && type !== 'income') {
      throw new AppError(
        'Please, check the type of transactions. Must be outcome or income',
        400,
      );
    }
    if (Math.sign(value) === -1)
      throw new AppError('Value must be a Positive, not a negative.', 400);

    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && balance.total < value)
      throw new AppError('Insufficient balance for the transaction.', 400);

    let categories = await categoriesRepository.findCategory(category);

    if (categories === null) {
      categories = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categories);
    }
    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categories.id,
    });
    await transactionRepository.save(transaction);

    transaction.category = categories;
    return transaction;
  }
}

export default CreateTransactionService;
