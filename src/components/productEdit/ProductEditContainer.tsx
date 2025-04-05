import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProductEdit from './ProductEdit';
import { Product } from './types';

const ProductEditContainer: React.FC = () => {
  const [productsState, setProductsState] = useState<Product[]>(() => {
    // Initialize state from localStorage if available
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  // Save products to localStorage whenever they change
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
    console.log('ProductEditContainer - Adding new product:', newProduct);
    const productWithDefaults: Product = {
      ...newProduct,
      id: Date.now(), // Generate a unique ID for each product
      stock: 0,
      sales: 0,
      discount: 0,
      price: Number(newProduct.price) || 0,
      rating: Number(newProduct.rating) || 0,
      image: newProduct.image || '/placeholder-image.png',
      sku: newProduct.sku || '',
      createdAt: newProduct.createdAt || new Date().toISOString().split('T')[0],
    };

    // Add the new product to the existing products array
    setProductsState((prevProducts) => [...prevProducts, productWithDefaults]);
    setItemNoState((prev) => prev + 1);
    setSubTotalState((prev) => prev + productWithDefaults.price);

    // Reset the form after successful submission
    resetForm();
  };

  const handleUpdateItem = (
    updatedProduct: Omit<Product, 'stock' | 'sales' | 'discount'>
  ) => {
    setProductsState((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              stock: product.stock || 0,
              sales: product.sales || 0,
              discount: product.discount || 0,
            }
          : product
      )
    );
  };

  const handleDeleteItem = (productId: number) => {
    setProductsState((prevProducts) => {
      const deletedProduct = prevProducts.find((p) => p.id === productId);
      if (deletedProduct) {
        setSubTotalState((prev) => prev - deletedProduct.price);
        setItemNoState((prev) => prev - 1);
      }
      return prevProducts.filter((product) => product.id !== productId);
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

  const handleAddDiscount = () => {
    // TODO: Implement discount logic
  };

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
