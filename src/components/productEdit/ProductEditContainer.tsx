import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProductEdit from './ProductEdit';
import { Product } from './types';

const ProductEditContainer: React.FC = () => {
  const [productsState, setProductsState] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];

    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(productsState));
  }, [productsState]);

  const [itemNoState, setItemNoState] = useState(0);
  const [subTotalState, setSubTotalState] = useState(0);
  const [discountState, setDiscountState] = useState(0);

  const handleAddItem = (
    newProduct: Omit<Product, 'stock' | 'sales' | 'discount'>,
    resetForm: () => void
  ) => {
    console.log(
      'ProductEditContainer - Adding new product:',
      JSON.stringify(newProduct, null, 2)
    );
    const productWithDefaults: Product = {
      ...newProduct,

      id: Date.now(),
      stock: 0,
      sales: 0,
      discount: 0,
      price: Number(newProduct.price) || 0,
      rating: Number(newProduct.rating) || 0,
      image: newProduct.image || '/placeholder-image.png',
      sku: newProduct.sku || '',
      createdAt: newProduct.createdAt || new Date().toISOString().split('T')[0],
    };

    setProductsState((prevProducts) => [...prevProducts, productWithDefaults]);
    setItemNoState((prev) => prev + 1);
    setSubTotalState((prev) => prev + productWithDefaults.price);

    resetForm();
  };

  const handleUpdateItem = (
    updatedProduct: Omit<Product, 'stock' | 'sales' | 'discount'>
  ) => {
    setProductsState((prevProducts) => {
      if (!Array.isArray(prevProducts)) {
        return [];
      }

      return prevProducts.map((product) => {
        if (!product) return product;

        return product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              stock: product.stock || 0,
              sales: product.sales || 0,
              discount: product.discount || 0,
            }
          : product;
      });
    });
  };

  const handleDeleteItem = (productId: number) => {
    setProductsState((prevProducts) => {
      if (!Array.isArray(prevProducts)) {
        return [];
      }

      const deletedProduct = prevProducts.find((p) => p && p.id === productId);

      if (deletedProduct) {
        setSubTotalState((prev) => prev - (deletedProduct.price || 0));
        setItemNoState((prev) => prev - 1);
      }

      return prevProducts.filter(
        (product) => product && product.id !== productId
      );
    });
  };

  const handleNewSession = () => {
    setProductsState([]);
    setItemNoState(0);
    setSubTotalState(0);
    setDiscountState(0);
  };

  const handleCollectPayment = () => {
    if (subTotalState - discountState <= 0) {
      return;
    }
    handleNewSession();
  };

  const handleAddDiscount = () => {};

  const handleCancelSession = () => {
    handleNewSession();
  };

  const total = subTotalState - discountState;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <ProductEdit
        products={productsState}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onNewSession={handleNewSession}
        onCollectPayment={handleCollectPayment}
        onAddDiscount={handleAddDiscount}
        onCancelSession={handleCancelSession}
        subTotal={subTotalState}
        discount={discountState}
        total={total}
        itemNo={itemNoState}
      />
    </Box>
  );
};

export default ProductEditContainer;
