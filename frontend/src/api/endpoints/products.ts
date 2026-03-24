import { apiClient } from '../client';
import { Product } from '../../types/product.types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },
};