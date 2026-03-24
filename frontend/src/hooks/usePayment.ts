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
import { DeliveryInfo } from '../types/payment.types';

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const { currentTransaction, paymentStatus, loading, error } = useAppSelector(
    (state) => state.transaction
  );
  const { currentStep } = useAppSelector((state) => state.ui);

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  const handleCreateTransaction = async (
    productId: string,
    deliveryData: DeliveryInfo
  ) => {
    setDeliveryInfo(deliveryData);
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
      const result = await dispatch(processPayment(currentTransaction.id)).unwrap();

      if (result) {
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
    dispatch(resetUI());
    setDeliveryInfo(null);
  };

  return {
    currentTransaction,
    deliveryInfo,
    paymentStatus,
    loading,
    error,
    currentStep,
    handleCreateTransaction,
    handleProcessPayment,
    handleResetPayment,
  };
};