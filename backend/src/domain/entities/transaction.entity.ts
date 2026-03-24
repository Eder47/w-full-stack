export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';

export interface TransactionProps {
  id: string;
  productId: string;
  amount: number;
  status: TransactionStatus;
  wompiTransactionId?: string | null;
  customerEmail: string;
  customerName?: string | null;
  deliveryAddress?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  private constructor(private readonly props: TransactionProps) {}

  static create(props: TransactionProps): Transaction {
    if (props.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    return new Transaction(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get wompiTransactionId(): string | null | undefined {
    return this.props.wompiTransactionId;
  }

  get customerEmail(): string {
    return this.props.customerEmail;
  }

  get customerName(): string | null | undefined {
    return this.props.customerName;
  }

  get deliveryAddress(): string | null | undefined {
    return this.props.deliveryAddress;
  }

  get errorMessage(): string | null | undefined {
    return this.props.errorMessage;
  }

  updateStatus(
    status: TransactionStatus,
    wompiTransactionId?: string,
    errorMessage?: string,
  ): void {
    this.props.status = status;
    if (wompiTransactionId) {
      this.props.wompiTransactionId = wompiTransactionId;
    }
    if (errorMessage) {
      this.props.errorMessage = errorMessage;
    }
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      productId: this.props.productId,
      amount: this.props.amount,
      status: this.props.status,
      wompiTransactionId: this.props.wompiTransactionId,
      customerEmail: this.props.customerEmail,
      customerName: this.props.customerName,
      deliveryAddress: this.props.deliveryAddress,
      errorMessage: this.props.errorMessage,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}