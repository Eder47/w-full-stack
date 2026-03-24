import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createTransaction,
  processPayment,
  clearTransaction,
} from '../store/slices/transactionSlice';
import {
  openSummaryBackdrop,
  openResultScreen,
  closePaymentModal,
  closeSummaryBackdrop,
  setCurrentStep,
  resetUI,
} from '../store/slices/uiSlice';
import { setDeliveryInfo, clearDeliveryInfo } from '../store/slices/deliverySlice';
import { DeliveryInfo } from '../types/payment.types';

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const { currentTransaction, paymentStatus, loading, error } = useAppSelector(
    (state) => state.transaction
  );
  const { currentStep, isSummaryBackdropOpen } = useAppSelector(
    (state) => state.ui
  );
  const { deliveryInfo } = useAppSelector((state) => state.delivery);

  const handleCreateTransaction = async (
    productId: string,
    deliveryData: DeliveryInfo
  ) => {
    

    dispatch(setDeliveryInfo(deliveryData));
    
    try {
      const result = await dispatch(
        createTransaction({
          productId,
          customerEmail: deliveryData.email,
          customerName: deliveryData.fullName,
          deliveryAddress: `${deliveryData.address}, ${deliveryData.city}`,
        })
      ).unwrap();
      
      if (result) {
        dispatch(closePaymentModal());
      
        dispatch(openSummaryBackdrop());
        dispatch(setCurrentStep(3));
      }

      return result;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  const handleProcessPayment = async () => {
    if (!currentTransaction) return;

    try {
      console.log('Procesando pago para:', currentTransaction.id);
      const result = await dispatch(processPayment(currentTransaction.id)).unwrap();

      if (result) {
        console.log('Pago procesado:', result);
        dispatch(closeSummaryBackdrop());
        dispatch(openResultScreen());
        dispatch(setCurrentStep(4));
      }

      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const handleResetPayment = () => {
    dispatch(clearTransaction());
    dispatch(clearDeliveryInfo());
    dispatch(resetUI());
  };

  return {
    currentTransaction,
    deliveryInfo,
    paymentStatus,
    loading,
    error,
    currentStep,
    isSummaryBackdropOpen,
    handleCreateTransaction,
    handleProcessPayment,
    handleResetPayment,
  };
};