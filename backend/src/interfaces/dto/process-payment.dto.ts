import { IsNotEmpty, IsString } from 'class-validator';

export class ProcessPaymentDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}