import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productsApi } from '../../api/endpoints/products';
import { Product } from '../../types/product.types';

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    return await productsApi.getAll();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string) => {
    return await productsApi.getById(id);
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    updateProductStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.stock = action.payload.stock;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct.stock = action.payload.stock;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });
  },
});

export const { clearSelectedProduct, updateProductStock } = productSlice.actions;
export default productSlice.reducer;