'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Product as ProductType } from '../components/productEdit/types';
import Image from 'next/image';

interface Product extends ProductType {
  image?: string;
}

interface ProductContextType {
  products: Product[];
  isLoaded: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const FALLBACK_IMAGE = '/404_icons.png';
const initialProducts: Product[] = [
  {
    id: 1,
    productName: 'Product 1',
    barcode: 'P001',
    sku: 'SKU001',
    price: 50,
    status: true,
    rating: 4.5,
    color: 'Black',
    createdAt: new Date().toISOString(),
    image: '/pos_1.jpg',
  },
  {
    id: 2,
    productName: 'Product 2',
    barcode: 'P002',
    sku: 'SKU002',
    price: 75,
    status: false,
    rating: 3.8,
    color: 'White',
    createdAt: new Date().toISOString(),
    image: '/pos_2.png',
  },
  {
    id: 3,
    productName: 'Product 3',
    barcode: 'P003',
    sku: 'SKU003',
    price: 120,
    status: true,
    rating: 4.2,
    color: 'Blue',
    createdAt: new Date().toISOString(),
    image: '/pos_3.png',
  },
];

export const ProductProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  const validateAndNormalizeProduct = useCallback(
    (product: Product): Product => {
      return {
        ...product,
        id: product.id || Date.now(),
        productName: product.productName || 'Unnamed Product',
        color: product.color || 'Black',
        barcode: product.barcode || `BC-${Date.now()}`,
        sku: product.sku || `SKU-${Date.now()}`,
        price: typeof product.price === 'number' ? product.price : 0,
        status: Boolean(product.status),
        rating: typeof product.rating === 'number' ? product.rating : 0,
        createdAt: product.createdAt || new Date().toISOString(),
        image: product.image || '/placeholder-image.png',
        statusProduct: product.status ? 'Active' : 'Inactive',
      };
    },
    []
  );

  useEffect(() => {
    const validateProduct = (product: Product): Product => {
      return {
        ...product,
        id: product.id || Date.now(),
        productName: product.productName || 'Unnamed Product',
        color: product.color || 'Black',
        barcode: product.barcode || `BC-${Date.now()}`,
        sku: product.sku || `SKU-${Date.now()}`,
        price: typeof product.price === 'number' ? product.price : 0,
        status: Boolean(product.status),
        rating: typeof product.rating === 'number' ? product.rating : 0,
        createdAt: product.createdAt || new Date().toISOString(),
        image: product.image || '/placeholder-image.png',
        statusProduct: product.status ? 'Active' : 'Inactive',
      };
    };

    try {
      const storedData = localStorage.getItem('products');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const validatedProducts = parsedData.map((product) =>
            validateProduct(product)
          );
          console.log(
            'ProductContext - Loaded and validated products from localStorage:',
            JSON.stringify(validatedProducts, null, 2)
          );
          setProducts(validatedProducts);
        }
      }
    } catch (error) {
      console.error(
        'Failed to load products from localStorage:',
        JSON.stringify(error, null, 2)
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('products', JSON.stringify(products));
      } catch (error) {
        console.error(
          'Failed to save products to localStorage:',
          JSON.stringify(error, null, 2)
        );
      }
    }
  }, [products, isLoaded]);

  const addProduct = useCallback(
    (newProduct: Product) => {
      const productToAdd = validateAndNormalizeProduct(newProduct);
      console.log(
        'ProductContext - Adding validated product:',
        JSON.stringify(productToAdd, null, 2)
      );

      setProducts((currentProducts) => [...currentProducts, productToAdd]);
    },
    [validateAndNormalizeProduct]
  );

  const updateProduct = useCallback(
    (updatedProduct: Product) => {
      const validatedProduct = validateAndNormalizeProduct(updatedProduct);
      console.log(
        'ProductContext - Updating with validated product:',
        JSON.stringify(validatedProduct, null, 2)
      );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === validatedProduct.id ? validatedProduct : product
        )
      );
    },
    [validateAndNormalizeProduct]
  );

  const deleteProduct = useCallback((productId: number) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  }, []);

  
  const contextValue = useMemo(
    () => ({
      products,
      isLoaded,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, isLoaded, addProduct, updateProduct, deleteProduct]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
export const ProductImage: React.FC<{
  product: Product;
  alt?: string;
  className?: string;
}> = ({ product, alt, className }) => {
  const [hasError, setHasError] = useState(false);
  const imageAlt = alt || product.productName;

  const imageSrc = hasError || !product.image ? FALLBACK_IMAGE : product.image;

  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
