import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (!(await transactionRepository.findOne({ where: { id } }))) {
      throw new AppError('Transaction not found', 404);
    }
    transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
