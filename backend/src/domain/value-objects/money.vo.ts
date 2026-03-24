export class Money {
  private constructor(private readonly amount: number) {}

  static create(amount: number): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount);
  }

  get value(): number {
    return this.amount;
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    if (this.amount < other.amount) {
      throw new Error('Insufficient funds');
    }
    return new Money(this.amount - other.amount);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  toString(): string {
    return `$${(this.amount / 100).toFixed(2)}`;
  }
}