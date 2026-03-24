import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProductRepositoryPort } from '../../../application/ports/repositories/product-repository.port';
import { Product } from '../../../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(product => 
      Product.create({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
    );
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async updateStock(id: string, stock: number): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock },
    });

    return Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async getStock(id: string): Promise<number> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product.stock;
  }
}