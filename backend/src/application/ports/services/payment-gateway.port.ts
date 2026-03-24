export interface PaymentRequest {
  transactionId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  cardToken: string;
  installments?: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'APPROVED' | 'DECLINED' | 'ERROR';
  message?: string;
}

export interface PaymentGatewayPort {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}