import React from 'react';
import { DeliveryInfo } from '../../../types/payment.types';
import styles from './DeliveryForm.module.scss';

interface DeliveryFormProps {
  deliveryInfo: DeliveryInfo;
  errors: Partial<DeliveryInfo>;
  onChange: (field: keyof DeliveryInfo, value: string) => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  deliveryInfo,
  errors,
  onChange,
}) => {
  return (
    <div className={styles.deliveryForm}>
      <div className={styles.field}>
        <label>Nombre Completo</label>
        <input
          type="text"
          placeholder="Juan Pérez"
          value={deliveryInfo.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className={errors.fullName ? styles.error : ''}
        />
        {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
      </div>

      <div className={styles.field}>
        <label>Correo Electrónico</label>
        <input
          type="email"
          placeholder="juan@ejemplo.com"
          value={deliveryInfo.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={errors.email ? styles.error : ''}
        />
        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label>Dirección</label>
        <input
          type="text"
          placeholder="Calle 123 #45-67"
          value={deliveryInfo.address}
          onChange={(e) => onChange('address', e.target.value)}
          className={errors.address ? styles.error : ''}
        />
        {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Ciudad</label>
          <input
            type="text"
            placeholder="Bogotá"
            value={deliveryInfo.city}
            onChange={(e) => onChange('city', e.target.value)}
            className={errors.city ? styles.error : ''}
          />
          {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
        </div>

        <div className={styles.field}>
          <label>Teléfono</label>
          <input
            type="tel"
            placeholder="3001234567"
            value={deliveryInfo.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={errors.phone ? styles.error : ''}
          />
          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>
      </div>
    </div>
  );
};