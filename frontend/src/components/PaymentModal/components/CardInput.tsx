import React from 'react';
import { CardInfo } from '../../../types/payment.types';
import styles from './CardInput.module.scss';

interface CardInputProps {
  cardInfo: CardInfo;
  errors: {
    number?: string;
    name?: string;
    expiryDate?: string;
    cvv?: string;
  };
  onChange: (field: keyof CardInfo, value: string) => void;
  onFormatCardNumber: (value: string) => string;
  onFormatExpiryDate: (value: string) => string;
}

export const CardInput: React.FC<CardInputProps> = ({
  cardInfo,
  errors,
  onChange,
  onFormatCardNumber,
  onFormatExpiryDate,
}) => {
  const getCardTypeIcon = () => {
    const number = cardInfo.number.replace(/\s/g, '');
    if (number.startsWith('4')) return '💳 Visa';
    if (number.startsWith('5')) return '💳 Mastercard';
    if (number.startsWith('3')) return '💳 Amex';
    return '💳 Tarjeta';
  };

  return (
    <div className={styles.cardInput}>
      <div className={styles.cardType}>
        <span>{getCardTypeIcon()}</span>
      </div>

      <div className={styles.field}>
        <label>Número de Tarjeta</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardInfo.number}
          onChange={(e) => onChange('number', onFormatCardNumber(e.target.value))}
          maxLength={19}
          className={errors.number ? styles.error : ''}
        />
        {errors.number && <span className={styles.errorMessage}>{errors.number}</span>}
      </div>

      <div className={styles.field}>
        <label>Nombre del Titular</label>
        <input
          type="text"
          placeholder="Juan Pérez"
          value={cardInfo.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={errors.name ? styles.error : ''}
        />
        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Fecha Expiración</label>
          <input
            type="text"
            placeholder="MM/AA"
            value={cardInfo.expiryDate}
            onChange={(e) => onChange('expiryDate', onFormatExpiryDate(e.target.value))}
            maxLength={5}
            className={errors.expiryDate ? styles.error : ''}
          />
          {errors.expiryDate && <span className={styles.errorMessage}>{errors.expiryDate}</span>}
        </div>

        <div className={styles.field}>
          <label>CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cardInfo.cvv}
            onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, ''))}
            maxLength={4}
            className={errors.cvv ? styles.error : ''}
          />
          {errors.cvv && <span className={styles.errorMessage}>{errors.cvv}</span>}
        </div>
      </div>
    </div>
  );
};