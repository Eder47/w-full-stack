import { useState, useCallback, useMemo } from 'react';
import * as cardValidator from 'card-validator';
import { CardInfo, CardValidationResult } from '../types/payment.types';

export const useCardValidation = () => {
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: '',
    name: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<CardValidationResult['errors']>({});


  const validationResult = useMemo(() => {
    const newErrors: CardValidationResult['errors'] = {};

    // Validar número de tarjeta
    const numberValidation = cardValidator.number(cardInfo.number);
    if (!cardInfo.number) {
      newErrors.number = 'Card number is required';
    } else if (!numberValidation.isValid) {
      newErrors.number = 'Invalid card number';
    }

    // Validar nombre
    if (!cardInfo.name) {
      newErrors.name = 'Name is required';
    } else if (cardInfo.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Validar fecha de expiración
    const expiryValidation = cardValidator.expirationDate(cardInfo.expiryDate);
    if (!cardInfo.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!expiryValidation.isValid) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }

    // Validar CVV
    const cvvValidation = cardValidator.cvv(cardInfo.cvv);
    if (!cardInfo.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!cvvValidation.isValid) {
      newErrors.cvv = 'Invalid CVV (3 or 4 digits)';
    }

    return {
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0,
    };
  }, [cardInfo.number, cardInfo.name, cardInfo.expiryDate, cardInfo.cvv]);

  const cardType = useMemo(() => {
    const validation = cardValidator.number(cardInfo.number);
    if (validation.card) {
      const type = validation.card.type;
      if (type === 'visa') return 'visa';
      if (type === 'mastercard') return 'mastercard';
      if (type === 'american-express') return 'amex';
    }
    return 'unknown';
  }, [cardInfo.number]);

  // Actualizar errors cuando cambia la validación
  useMemo(() => {
    setErrors(validationResult.errors);
  }, [validationResult.errors]);

  const updateCardInfo = useCallback((field: keyof CardInfo, value: string) => {
    setCardInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateCard = useCallback((): boolean => {
    return validationResult.isValid;
  }, [validationResult.isValid]);

  const formatCardNumber = useCallback((value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }, []);

  const formatExpiryDate = useCallback((value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  }, []);

  return {
    cardInfo,
    errors,
    isValid: validationResult.isValid,
    cardType,
    updateCardInfo,
    validateCard,
    formatCardNumber,
    formatExpiryDate,
  };
};