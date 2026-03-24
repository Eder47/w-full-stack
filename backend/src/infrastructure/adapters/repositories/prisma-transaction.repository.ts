import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionRepositoryPort, CreateTransactionDTO } from '../../../application/ports/repositories/transaction-repository.port';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        productId: data.productId,
        amount: data.amount,
        status: 'PENDING',
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
      },
    });

    return Transaction.create({
      id: transaction.id,
      productId: transaction.productId,
      amount: transaction.amount,
      status: transaction.status as TransactionStatus,
      wompiTransactionId: transaction.wompiTransactionId,
      customerEmail: transaction.customerEmail,
      customerName: transaction.customerName,
      deliveryAddress: transaction.deliveryAddress,
      errorMessage: transaction.errorMessage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) return null;

    return Transaction.create({
      id: transaction.id,
      productId: transaction.productId,
      amount: transaction.amount,
      status: transaction.status as TransactionStatus,
      wompiTransactionId: transaction.wompiTransactionId,
      customerEmail: transaction.customerEmail,
      customerName: transaction.customerName,
      deliveryAddress: transaction.deliveryAddress,
      errorMessage: transaction.errorMessage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
    errorMessage?: string,
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        wompiTransactionId,
        errorMessage,
      },
    });

    return Transaction.create({
      id: transaction.id,
      productId: transaction.productId,
      amount: transaction.amount,
      status: transaction.status as TransactionStatus,
      wompiTransactionId: transaction.wompiTransactionId,
      customerEmail: transaction.customerEmail,
      customerName: transaction.customerName,
      deliveryAddress: transaction.deliveryAddress,
      errorMessage: transaction.errorMessage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }
}