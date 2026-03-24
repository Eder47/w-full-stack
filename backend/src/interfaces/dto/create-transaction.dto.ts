import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  customerName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  deliveryAddress: string;
}