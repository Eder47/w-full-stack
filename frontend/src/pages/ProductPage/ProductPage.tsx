import React, { useState, useCallback } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { usePayment } from '../../hooks/usePayment';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openPaymentModal, setCurrentStep } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import styles from './ProductPage.module.scss';
import { PaymentModal } from '../../components/PaymentModal/PaymentModal';
import { SummaryBackdrop } from '../../components/SummaryBackdrop/SummaryBackdrop';
import { ResultScreen } from '../../components/ResultScreen/ResultScreen';

export const ProductPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { handleResetPayment, isSummaryBackdropOpen } = usePayment();
  const dispatch = useAppDispatch();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  console.log('ProductPage - isSummaryBackdropOpen:', isSummaryBackdropOpen);

  const handleBuyNow = useCallback((productId: string) => {
    setSelectedProductId(productId);
    dispatch(setCurrentStep(2));
    dispatch(openPaymentModal());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Nuestra Tienda</h1>
        <p>Descubre los mejores productos</p>
      </header>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <div className={styles.imagePlaceholder}>📱</div>
            </div>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  ${(product.price / 100).toLocaleString()}
                </span>
                <span className={`${styles.stock} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                  {product.stock > 0 ? `Disponible: ${product.stock}` : 'Agotado'}
                </span>
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={product.stock === 0}
                onClick={() => handleBuyNow(product.id)}
              >
                {product.stock > 0 ? 'Comprar Ahora' : 'Agotado'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedProductId && <PaymentModal productId={selectedProductId} />}
      <SummaryBackdrop />
      <ResultScreen onClose={handleResetPayment} />
    </div>
  );
};