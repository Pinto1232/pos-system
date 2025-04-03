import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../components/productEdit/types';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
    {
        id: 1,
        productName: "Product 1",
        barcode: "P001",
        sku: "SKU001",
        price: 50,
        status: true,
        rating: 4.5,
        color: "Black",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        productName: "Product 2",
        barcode: "P002",
        sku: "SKU002",
        price: 75,
        status: false,
        rating: 3.8,
        color: "White",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        productName: "Product 3",
        barcode: "P003",
        sku: "SKU003",
        price: 120,
        status: true,
        rating: 4.2,
        color: "Blue",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150"
    }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Product) => {
        setProducts(prevProducts => [...prevProducts, product]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const deleteProduct = (productId: number) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
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