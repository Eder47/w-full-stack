import { apiClient } from '../client';
import {
  Transaction,
  CreateTransactionRequest,
  ProcessPaymentRequest,
} from '../../types/transaction.types';

export const transactionsApi = {
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', data);
    return response.data.data;
  },

  processPayment: async (data: ProcessPaymentRequest): Promise<Transaction> => {
    const response = await apiClient.post('/transactions/process-payment', data);
    return response.data.data;
  },
};