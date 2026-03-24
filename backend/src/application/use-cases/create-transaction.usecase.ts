import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from '../ports/repositories/transaction-repository.port';
import { ProductRepositoryPort } from '../ports/repositories/product-repository.port';
import { success, failure, Result } from '../../shared/result/result';
import { AppError } from '../../shared/errors/app-error';
import { Transaction } from '../../domain/entities/transaction.entity';

export interface CreateTransactionInput {
  productId: string;
  customerEmail: string;
  customerName: string;
  deliveryAddress: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Result<Transaction, AppError>> {
    try {
     
      if (!input.productId) {
        return failure(new AppError('INVALID_INPUT', 'Product ID is required', 400));
      }
      if (!input.customerEmail || !input.customerEmail.includes('@')) {
        return failure(new AppError('INVALID_INPUT', 'Valid email is required', 400));
      }
      if (!input.customerName || input.customerName.trim().length < 3) {
        return failure(new AppError('INVALID_INPUT', 'Valid customer name is required', 400));
      }
      if (!input.deliveryAddress || input.deliveryAddress.trim().length < 5) {
        return failure(new AppError('INVALID_INPUT', 'Valid delivery address is required', 400));
      }

    
      const product = await this.productRepo.findById(input.productId);
      if (!product) {
        return failure(new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404));
      }

     
      if (product.stock <= 0) {
        return failure(new AppError('OUT_OF_STOCK', 'Product out of stock', 400));
      }

   
      const baseFee = 3000;
      const deliveryFee = 5000;
      const totalAmount = product.price + baseFee + deliveryFee;

     
      const transaction = await this.transactionRepo.create({
        productId: input.productId,
        amount: totalAmount,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        deliveryAddress: input.deliveryAddress,
      });

      return success(transaction);
    } catch (error) {
      console.error('CreateTransactionUseCase error:', error);
      return failure(new AppError('INTERNAL_ERROR', 'Error creating transaction', 500));
    }
  }
}