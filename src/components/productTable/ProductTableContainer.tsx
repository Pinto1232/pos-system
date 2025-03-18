"use client";

import React, { useState } from "react";
import ProductTable from "@/components/productTable/ProductTable";

const ProductTableContainer = () => {
  const [products, setProducts] = useState([
    { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "No", avatar: "https://i.pravatar.cc/150?img=1" },
    { barcode: "5-90443455432", no: "0000000", name: "Milk", stock: "In Stock", price: "R2.000.00", discount: "Yes", avatar: "https://i.pravatar.cc/150?img=2" },
    { barcode: "5-90443455432", no: "0000000", name: "Eggs", stock: "Pending", price: "R2.000.00", discount: "No", avatar: "https://i.pravatar.cc/150?img=3" },
    { barcode: "5-90443455432", no: "0000000", name: "Cheese", stock: "In Stock", price: "R2.000.00", discount: "No", avatar: "https://i.pravatar.cc/150?img=4" },
    { barcode: "5-90443455432", no: "0000000", name: "Butter", stock: "Sold out", price: "R2.000.00", discount: "No", avatar: "https://i.pravatar.cc/150?img=5" },
    { barcode: "5-90443455432", no: "0000000", name: "Juice", stock: "In Stock", price: "R2.000.00", discount: "Yes", avatar: "https://i.pravatar.cc/150?img=6" },
    { barcode: "5-90443455432", no: "0000000", name: "Yogurt", stock: "In Stock", price: "R2.000.00", discount: "Yes", avatar: "https://i.pravatar.cc/150?img=7" },
    { barcode: "5-90443455432", no: "0000000", name: "Cereal", stock: "Sold out", price: "R2.000.00", discount: "Yes", avatar: "https://i.pravatar.cc/150?img=8" },
    { barcode: "5-90443455432", no: "0000000", name: "Pasta", stock: "In Stock", price: "R2.000.00", discount: "No", avatar: "https://i.pravatar.cc/150?img=9" },
    { barcode: "5-90443455432", no: "0000000", name: "Rice", stock: "Pending", price: "R2.000.00", discount: "Yes", avatar: "https://i.pravatar.cc/150?img=10" },
  ]);

  const handleDiscountToggle = (index: number, newValue: string) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = newValue;
    setProducts(updatedProducts);
  };

  return <ProductTable products={products} onDiscountToggle={handleDiscountToggle} />;
};

export default ProductTableContainer;
