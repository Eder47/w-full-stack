import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';

export interface CreateTransactionDTO {
  productId: string;
  amount: number;
  customerEmail: string;
  customerName?: string;
  deliveryAddress?: string;
}

export interface TransactionRepositoryPort {
  create(data: CreateTransactionDTO): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    errorMessage?: string,
  ): Promise<Transaction>;
}