export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';

export interface Transaction {
  id: string;
  productId: string;
  amount: number;
  status: TransactionStatus;
  wompiTransactionId?: string;
  customerEmail: string;
  customerName?: string;
  deliveryAddress?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  productId: string;
  customerEmail: string;
  customerName: string;
  deliveryAddress: string;
}

export interface ProcessPaymentRequest {
  transactionId: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction;
}