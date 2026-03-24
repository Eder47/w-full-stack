import React, { useState, useCallback } from 'react';
import { useCardValidation } from '../../hooks/useCardValidation';
import { usePayment } from '../../hooks/usePayment';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closePaymentModal } from '../../store/slices/uiSlice';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { CardInput } from './components/CardInput';
import { DeliveryForm } from './components/DeliveryForm';
import { DeliveryInfo } from '../../types/payment.types';
import styles from './PaymentModal.module.scss';

interface PaymentModalProps {
  productId: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { isPaymentModalOpen } = useAppSelector((state) => state.ui);
  const { handleCreateTransaction, loading } = usePayment();
  const { 
    cardInfo, 
    errors, 
    updateCardInfo, 
    validateCard, 
    formatCardNumber, 
    formatExpiryDate 
  } = useCardValidation();

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  const [deliveryErrors, setDeliveryErrors] = useState<Partial<DeliveryInfo>>({});

  const validateDelivery = useCallback((): boolean => {
    const newErrors: Partial<DeliveryInfo> = {};

    if (!deliveryInfo.fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!deliveryInfo.email.trim()) newErrors.email = 'El email es requerido';
    if (!deliveryInfo.email.includes('@')) newErrors.email = 'Email inválido';
    if (!deliveryInfo.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!deliveryInfo.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!deliveryInfo.phone.trim()) newErrors.phone = 'El teléfono es requerido';

    setDeliveryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [deliveryInfo]);

  const handleSubmit = useCallback(async () => {
    const isCardValid = validateCard();
    const isDeliveryValid = validateDelivery();

    if (isCardValid && isDeliveryValid) {
      await handleCreateTransaction(productId, deliveryInfo);
    }
  }, [validateCard, validateDelivery, handleCreateTransaction, productId, deliveryInfo]);

  const handleClose = useCallback(() => {
    dispatch(closePaymentModal());
  }, [dispatch]);

  const handleDeliveryChange = useCallback((field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <Modal isOpen={isPaymentModalOpen} onClose={handleClose} title="Información de Pago">
      <div className={styles.paymentModal}>
        <div className={styles.section}>
          <h3>Información de Envío</h3>
          <DeliveryForm
            deliveryInfo={deliveryInfo}
            errors={deliveryErrors}
            onChange={handleDeliveryChange}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h3>Información de Tarjeta</h3>
          <CardInput
            cardInfo={cardInfo}
            errors={errors}
            onChange={updateCardInfo}
            onFormatCardNumber={formatCardNumber}
            onFormatExpiryDate={formatExpiryDate}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Continuar al Resumen
          </Button>
        </div>
      </div>
    </Modal>
  );
};