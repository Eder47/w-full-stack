import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from '../ports/repositories/transaction-repository.port';
import { ProductRepositoryPort } from '../ports/repositories/product-repository.port';
import { success, failure, Result } from '../../shared/result/result';
import { AppError } from '../../shared/errors/app-error';
import { Product } from '../../domain/entities/product.entity';

export interface UpdateStockInput {
  transactionId: string;
}

@Injectable()
export class UpdateStockUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(input: UpdateStockInput): Promise<Result<Product, AppError>> {
    try {
    
      if (!input.transactionId) {
        return failure(new AppError('INVALID_INPUT', 'Transaction ID is required', 400));
      }

   
      const transaction = await this.transactionRepo.findById(input.transactionId);
      if (!transaction) {
        return failure(new AppError('TRANSACTION_NOT_FOUND', 'Transaction not found', 404));
      }

     
      if (transaction.status !== 'APPROVED') {
        return failure(
          new AppError('INVALID_STATUS', 'Cannot update stock for non-approved transaction', 400),
        );
      }

   
      const product = await this.productRepo.findById(transaction.productId);
      if (!product) {
        return failure(new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404));
      }

   
      if (product.stock <= 0) {
        return failure(new AppError('OUT_OF_STOCK', 'Product out of stock', 400));
      }

   
      const newStock = product.stock - 1;
      const updatedProduct = await this.productRepo.updateStock(product.id, newStock);

      return success(updatedProduct);
    } catch (error) {
      console.error('UpdateStockUseCase error:', error);
      return failure(new AppError('INTERNAL_ERROR', 'Error updating stock', 500));
    }
  }
}