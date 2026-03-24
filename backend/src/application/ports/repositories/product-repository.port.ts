import { Product } from '../../../domain/entities/product.entity';

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  updateStock(id: string, stock: number): Promise<Product>;
  getStock(id: string): Promise<number>;
}