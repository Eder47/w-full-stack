import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.usecase';
import { ProcessPaymentUseCase } from '../../application/use-cases/process-payment.usecase';
import { UpdateStockUseCase } from '../../application/use-cases/update-stock.usecase';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
  ) {}

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.execute(dto);

    if (result.isFailure()) {
      throw new HttpException(
        {
          success: false,
          message: result.error.message,
          code: result.error.code,
        },
        result.error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      data: result.value.toJSON(),
    };
  }

  @Post('process-payment')
  async processPayment(@Body() dto: ProcessPaymentDto) {
    const paymentResult = await this.processPaymentUseCase.execute(dto);

    if (paymentResult.isFailure()) {
      throw new HttpException(
        {
          success: false,
          message: paymentResult.error.message,
          code: paymentResult.error.code,
        },
        paymentResult.error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = paymentResult.value;
    
    if (transaction.status === 'APPROVED') {
      const stockResult = await this.updateStockUseCase.execute({
        transactionId: transaction.id,
      });

      if (stockResult.isFailure()) {
        console.error('Error updating stock:', stockResult.error);
      }
    }

    return {
      success: true,
      data: transaction.toJSON(),
    };
  }
}