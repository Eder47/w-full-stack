import React from 'react';
import { usePayment } from '../../hooks/usePayment';
import { useAppSelector } from '../../store/hooks';
import { Button } from '../common/Button';
import { Backdrop } from '../common/Backdrop';
import styles from './ResultScreen.module.scss';

interface ResultScreenProps {
  onClose: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ onClose }) => {
  const { isResultScreenOpen } = useAppSelector((state) => state.ui);
  const { currentTransaction, paymentStatus } = usePayment();

  const isSuccess = paymentStatus === 'success' && currentTransaction?.status === 'APPROVED';
  const isError = paymentStatus === 'error' || currentTransaction?.status === 'DECLINED';

  return (
    <Backdrop isOpen={isResultScreenOpen}>
      <div className={styles.result}>
        {isSuccess && (
          <>
            <div className={`${styles.icon} ${styles.success}`}>✓</div>
            <h2>¡Pago Exitoso!</h2>
            <p>Tu transacción se ha completado correctamente.</p>
            <div className={styles.details}>
              <p><strong>ID Transacción:</strong> {currentTransaction?.id}</p>
              <p><strong>Monto:</strong> ${((currentTransaction?.amount || 0) / 100).toLocaleString()}</p>
              <p><strong>Estado:</strong> Aprobado</p>
            </div>
            <Button variant="primary" onClick={onClose}>
              Seguir Comprando
            </Button>
          </>
        )}

        {isError && (
          <>
            <div className={`${styles.icon} ${styles.error}`}>✗</div>
            <h2>Pago Fallido</h2>
            <p>{currentTransaction?.errorMessage || 'Hubo un error al procesar tu pago. Por favor intenta nuevamente.'}</p>
            <Button variant="primary" onClick={onClose}>
              Intentar Nuevamente
            </Button>
          </>
        )}
      </div>
    </Backdrop>
  );
};