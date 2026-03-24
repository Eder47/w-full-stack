import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from '../ports/repositories/transaction-repository.port';
import { PaymentGatewayPort } from '../ports/services/payment-gateway.port';
import { ProductRepositoryPort } from '../ports/repositories/product-repository.port';
import { success, failure, Result } from '../../shared/result/result';
import { AppError } from '../../shared/errors/app-error';
import { Transaction } from '../../domain/entities/transaction.entity';

export interface ProcessPaymentInput {
  transactionId: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<Result<Transaction, AppError>> {
    try {
    
      const validationResult = this.validateInput(input);
      if (validationResult.isFailure()) {
        return validationResult;
      }

      
      const transaction = await this.transactionRepo.findById(input.transactionId);
      if (!transaction) {
        return failure(new AppError('TRANSACTION_NOT_FOUND', 'Transaction not found', 404));
      }

     
      if (transaction.status !== 'PENDING') {
        return failure(
          new AppError('INVALID_STATUS', `Transaction already ${transaction.status}`, 400),
        );
      }

    
      const paymentResult = await this.paymentGateway.processPayment({
        transactionId: transaction.id,
        amount: transaction.amount,
        currency: 'COP',
        customerEmail: transaction.customerEmail,
        cardToken: 'tok_test_visa_4242', 
      });

    
      let updatedTransaction: Transaction;

      if (paymentResult.success && paymentResult.status === 'APPROVED') {
        updatedTransaction = await this.transactionRepo.updateStatus(
          transaction.id,
          'APPROVED',
          paymentResult.transactionId,
        );
      } else {
        updatedTransaction = await this.transactionRepo.updateStatus(
          transaction.id,
          'DECLINED',
          undefined,
          paymentResult.message || 'Payment declined',
        );
      }

      return success(updatedTransaction);
    } catch (error) {
      console.error('ProcessPaymentUseCase error:', error);
      return failure(new AppError('INTERNAL_ERROR', 'Error processing payment', 500));
    }
  }

  private validateInput(input: ProcessPaymentInput): Result<void, AppError> {
    if (!input.transactionId) {
      return failure(new AppError('INVALID_INPUT', 'Transaction ID is required', 400));
    }
    return success(undefined);
  }
}