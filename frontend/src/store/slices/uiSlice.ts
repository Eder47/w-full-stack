// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isPaymentModalOpen: boolean;
  isSummaryBackdropOpen: boolean;
  isResultScreenOpen: boolean;
  currentStep: 1 | 2 | 3 | 4;
}

const initialState: UIState = {
  isPaymentModalOpen: false,
  isSummaryBackdropOpen: false,
  isResultScreenOpen: false,
  currentStep: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openPaymentModal: (state) => {
      state.isPaymentModalOpen = true;
    },
    closePaymentModal: (state) => {
      state.isPaymentModalOpen = false;
    },
    openSummaryBackdrop: (state) => {
      console.log('📋 REDUCER: Abriendo resumen, estado actual:', state.isSummaryBackdropOpen);
      state.isSummaryBackdropOpen = true;
      console.log('📋 REDUCER: Nuevo estado:', state.isSummaryBackdropOpen);
    },
    closeSummaryBackdrop: (state) => {
      console.log('📋 REDUCER: Cerrando resumen');
      state.isSummaryBackdropOpen = false;
    },
    openResultScreen: (state) => {
      state.isResultScreenOpen = true;
    },
    closeResultScreen: (state) => {
      state.isResultScreenOpen = false;
    },
    setCurrentStep: (state, action: PayloadAction<1 | 2 | 3 | 4>) => {
      state.currentStep = action.payload;
    },
    resetUI: (state) => {
      state.isPaymentModalOpen = false;
      state.isSummaryBackdropOpen = false;
      state.isResultScreenOpen = false;
      state.currentStep = 1;
    },
  },
});

export const {
  openPaymentModal,
  closePaymentModal,
  openSummaryBackdrop,
  closeSummaryBackdrop,
  openResultScreen,
  closeResultScreen,
  setCurrentStep,
  resetUI,
} = uiSlice.actions;
export default uiSlice.reducer;