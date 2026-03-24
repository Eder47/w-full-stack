import { Controller, Get, Param, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ProductRepositoryPort } from '../../application/ports/repositories/product-repository.port';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  @Get()
  async findAll() {
    try {
      const products = await this.productRepo.findAll();
      return {
        success: true,
        data: products.map(p => p.toJSON()),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error fetching products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const product = await this.productRepo.findById(id);
      
      if (!product) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: product.toJSON(),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      
      throw new HttpException(
        {
          success: false,
          message: 'Error fetching product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}