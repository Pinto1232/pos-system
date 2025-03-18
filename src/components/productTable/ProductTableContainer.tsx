"use client";

import React from "react";
import ProductTable from "@/components/productTable/ProductTable";

const products = [
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "No" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "Yes" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "Pending", price: "R2.000.00", discount: "No" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "No" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "Sold out", price: "R2.000.00", discount: "No" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "Yes" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "Yes" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "Sold out", price: "R2.000.00", discount: "Yes" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "In Stock", price: "R2.000.00", discount: "No" },
  { barcode: "5-90443455432", no: "0000000", name: "Bread", stock: "Pending", price: "R2.000.00", discount: "Yes" },
];

const ProductTableContainer = () => {
  return <ProductTable products={products} />;
};

export default ProductTableContainer;
