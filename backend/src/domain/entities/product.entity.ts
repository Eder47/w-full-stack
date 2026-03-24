export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: ProductProps): Product {
    if (props.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    if (props.stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    return new Product(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get stock(): number {
    return this.props.stock;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.props.stock = newStock;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      price: this.props.price,
      stock: this.props.stock,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}