import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './infrastructure/database/prisma.service';
import { UpdateStockUseCase } from './application/use-cases/update-stock.usecase';
import { ProductController } from './interfaces/controllers/product.controller';
import { TransactionController } from './interfaces/controllers/transaction.controller';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.usecase';
import { PrismaProductRepository } from './infrastructure/adapters/repositories/prisma-product.repository';
import { PrismaTransactionRepository } from './infrastructure/adapters/repositories/prisma-transaction.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { WompiPaymentAdapter } from './infrastructure/adapters/services/wompi-payment.adapter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ProductController, TransactionController],
  providers: [
    PrismaService,
    
    CreateTransactionUseCase,
    ProcessPaymentUseCase,
    UpdateStockUseCase,
    

    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
    {
      provide: 'TransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    
    {
      provide: 'PaymentGateway',
      useClass: WompiPaymentAdapter,
    },
  ],
})
export class AppModule {}