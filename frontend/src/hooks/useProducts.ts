import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchProductById } from '../store/slices/productSlice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { items, selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );


  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length, loading]);

  const getProductById = (id: string) => {
    dispatch(fetchProductById(id));
  };

  return {
    products: items,
    selectedProduct,
    loading,
    error,
    getProductById,
  };
};