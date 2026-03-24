import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsApi } from '../../api/endpoints/transactions';
import { Transaction, CreateTransactionRequest } from '../../types/transaction.types';

interface TransactionState {
  currentTransaction: Transaction | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
  paymentStatus: 'idle',
  loading: false,
  error: null,
};

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (data: CreateTransactionRequest) => {
    return await transactionsApi.create(data);
  }
);

export const processPayment = createAsyncThunk(
  'transactions/processPayment',
  async (transactionId: string) => {
    return await transactionsApi.processPayment({ transactionId });
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransaction: (state) => {
      state.currentTransaction = null;
      state.paymentStatus = 'idle';
      state.error = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create transaction';
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.paymentStatus = 'processing';
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.paymentStatus = 'success';
        state.currentTransaction = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentStatus = 'error';
        state.error = action.error.message || 'Payment failed';
      });
  },
});

export const { clearTransaction, resetPaymentStatus } = transactionSlice.actions;
export default transactionSlice.reducer;