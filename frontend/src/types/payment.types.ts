export interface CardInfo {
  number: string;
  name: string;
  expiryDate: string;
  cvv: string;
}

export interface CardValidationResult {
  isValid: boolean;
  cardType: 'visa' | 'mastercard' | 'amex' | 'unknown';
  errors: {
    number?: string;
    name?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface DeliveryInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}