'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

const ProductContext = createContext<
  ProductContextType | undefined
>(undefined);

const FALLBACK_IMAGE = '/public/404_icons.png';
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
    image: '/public/pos_1.jpg',
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
    image: '/public/pos_2.png',
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
    image: '/public/pos_3.png',
  },
];

export const ProductProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [products, setProducts] = useState<
    Product[]
  >(initialProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData =
        localStorage.getItem('products');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (
          Array.isArray(parsedData) &&
          parsedData.length > 0
        ) {
          setProducts(parsedData);
        }
      }
    } catch (error) {
      console.error(
        'Failed to load products from localStorage:',
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          'products',
          JSON.stringify(products)
        );
      } catch (error) {
        console.error(
          'Failed to save products to localStorage:',
          error
        );
      }
    }
  }, [products, isLoaded]);

  const addProduct = (newProduct: Product) => {
    const productToAdd = {
      ...newProduct,
      id:
        newProduct.id ||
        Math.max(
          0,
          ...products.map((p) => p.id)
        ) + 1,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      productToAdd,
    ]);
  };

  const updateProduct = (
    updatedProduct: Product
  ) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );
  };

  const deleteProduct = (productId: number) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  const contextValue: ProductContextType = {
    products,
    isLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'useProductContext must be used within a ProductProvider'
    );
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

  const imageSrc =
    hasError || !product.image
      ? FALLBACK_IMAGE
      : product.image;

  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
