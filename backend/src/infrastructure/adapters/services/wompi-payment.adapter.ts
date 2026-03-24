import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaymentGatewayPort, PaymentRequest, PaymentResponse } from '../../../application/ports/services/payment-gateway.port';

@Injectable()
export class WompiPaymentAdapter implements PaymentGatewayPort {
  private readonly apiUrl: string;
  private readonly publicKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('WOMPI_API_URL')!;
    this.publicKey = this.configService.get('WOMPI_PUBLIC_KEY')!;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {

      const mockCardToken = 'tok_test_visa_4242';

      const response = await axios.post(
        `${this.apiUrl}/transactions`,
        {
          amount_in_cents: request.amount,
          currency: request.currency,
          customer_email: request.customerEmail,
          payment_method: {
            type: 'CARD',
            token: mockCardToken,
            installments: request.installments || 1,
          },
          reference: request.transactionId,
          payment_source_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const wompiResponse = response.data.data;
      const status = wompiResponse.status === 'APPROVED' ? 'APPROVED' : 'DECLINED';

      return {
        success: status === 'APPROVED',
        transactionId: wompiResponse.id,
        status,
        message: wompiResponse.status_message,
      };
    } catch (error: any) {
      console.error('Wompi API Error:', error.response?.data || error.message);
      
      return {
        success: false,
        status: 'ERROR',
        message: error.response?.data?.error?.message || 'Payment processing failed',
      };
    }
  }
}