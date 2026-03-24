import React, { useEffect } from 'react';
import { usePayment } from '../../hooks/usePayment';
import { useProducts } from '../../hooks/useProducts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeSummaryBackdrop } from '../../store/slices/uiSlice';
import { Button } from '../common/Button';
import { Backdrop } from '../common/Backdrop';
import styles from './SummaryBackdrop.module.scss';

export const SummaryBackdrop: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSummaryBackdropOpen } = useAppSelector((state) => state.ui);
  const { currentTransaction, handleProcessPayment, loading } = usePayment();
  const { products } = useProducts();
  const { deliveryInfo } = useAppSelector((state) => state.delivery);


  const product = currentTransaction 
    ? products.find(p => p.id === currentTransaction.productId)
    : null;

  const baseFee = 3000;
  const deliveryFee = 5000;
  
  const totalAmount = currentTransaction?.amount || 0;
  const subtotal = totalAmount > 0 ? totalAmount - baseFee - deliveryFee : 0;

  if (!currentTransaction) {
    return null;
  }

  return (
    <Backdrop isOpen={isSummaryBackdropOpen}>
      <div className={styles.summary}>
        <h2>Resumen del Pedido</h2>
        
        <div className={styles.productInfo}>
          <h3>{product?.name || 'Producto'}</h3>
          <p className={styles.price}>${(subtotal / 100).toLocaleString()}</p>
        </div>

        <div className={styles.deliveryInfo}>
          <h3>Detalles de Envío</h3>
          <p><strong>Nombre:</strong> {deliveryInfo?.fullName || 'No disponible'}</p>
          <p><strong>Email:</strong> {deliveryInfo?.email || 'No disponible'}</p>
          <p><strong>Dirección:</strong> {deliveryInfo?.address || 'No disponible'}, {deliveryInfo?.city || ''}</p>
          <p><strong>Teléfono:</strong> {deliveryInfo?.phone || 'No disponible'}</p>
        </div>

        <div className={styles.breakdown}>
          <div className={styles.row}>
            <span>Subtotal</span>
            <span>${(subtotal / 100).toLocaleString()}</span>
          </div>
          <div className={styles.row}>
            <span>Comisión Base</span>
            <span>${(baseFee / 100).toLocaleString()}</span>
          </div>
          <div className={styles.row}>
            <span>Costo de Envío</span>
            <span>${(deliveryFee / 100).toLocaleString()}</span>
          </div>
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total</span>
            <span>${(totalAmount / 100).toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => dispatch(closeSummaryBackdrop())}>
            Atrás
          </Button>
          <Button variant="primary" onClick={handleProcessPayment} loading={loading}>
            Pagar Ahora
          </Button>
        </div>
      </div>
    </Backdrop>
  );
};