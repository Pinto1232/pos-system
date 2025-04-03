"use client";

import React, { useState, useMemo } from "react";
import ProductTable from "./ProductTable";
import { useProductContext } from "@/contexts/ProductContext";
import { Product } from '../productEdit/types';
import { SelectChangeEvent } from "@mui/material/Select";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductTableContainer: React.FC = () => {
  const { products, updateProduct } = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Memoize the filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.idCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(product => product.color === categoryFilter);
    }

    // Apply rating filter
    if (ratingFilter !== "All") {
      const ratingValue = parseInt(ratingFilter);
      filtered = filtered.filter(product => Math.floor(product.rating) === ratingValue);
    }

    // Apply status filter
    if (statusFilter !== "All") {
      if (statusFilter === "Available") {
        filtered = filtered.filter(product => product.status === true);
      } else if (statusFilter === "Out of Stock") {
        filtered = filtered.filter(product => product.status === false);
      }
    }

    // Apply price filter
    if (priceFilter !== "All") {
      switch (priceFilter) {
        case "R10-R100":
          filtered = filtered.filter(product => product.price >= 10 && product.price <= 100);
          break;
        case "R100-R500":
          filtered = filtered.filter(product => product.price >= 100 && product.price <= 500);
          break;
        case "R500-R1000":
          filtered = filtered.filter(product => product.price >= 500 && product.price <= 1000);
          break;
        case "R1000+":
          filtered = filtered.filter(product => product.price > 1000);
          break;
      }
    }

    return filtered;
  }, [products, searchQuery, categoryFilter, ratingFilter, statusFilter, priceFilter]);

  // Memoize paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, rowsPerPage]);

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePriceChange = (event: SelectChangeEvent) => {
    setPriceFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const handleRatingChange = (event: SelectChangeEvent) => {
    setRatingFilter(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleStatusToggle = (product: Product) => {
    const updatedProduct = { ...product, status: !product.status };
    updateProduct(updatedProduct);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setRatingFilter("All");
    setStatusFilter("All");
    setPriceFilter("All");
    setPage(0);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add title
    doc.setFontSize(16);
    doc.text('Product List', 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare data for the table
    const tableData = filteredProducts.map(product => [
      product.name,
      product.idCode,
      product.sku || '-',
      `R${product.price.toFixed(2)}`,
      product.status ? 'In Stock' : 'Out of Stock',
      product.rating.toString(),
      product.color || 'N/A',
      new Date(product.createdAt).toLocaleDateString()
    ]);

    // Add the table
    autoTable(doc, {
      startY: 30,
      head: [['Product Name', 'ID Code', 'SKU', 'Price', 'Status', 'Rating', 'Color', 'Created At']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 3
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 50, overflow: 'linebreak' },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 }
      },
      margin: { left: 10, right: 10 },
      tableWidth: 'auto',
      horizontalPageBreak: true,
      showHead: 'everyPage',
      pageBreak: 'auto'
    });

    doc.save('product-list.pdf');
  };

  return (
    <ProductTable
      products={paginatedProducts}
      filteredProducts={filteredProducts}
      selectedProduct={selectedProduct}
      isViewModalOpen={isViewModalOpen}
      page={page}
      rowsPerPage={rowsPerPage}
      searchQuery={searchQuery}
      categoryFilter={categoryFilter}
      ratingFilter={ratingFilter}
      statusFilter={statusFilter}
      priceFilter={priceFilter}
      onView={handleView}
      onCloseModal={handleCloseModal}
      onPriceChange={handlePriceChange}
      onSearchChange={handleSearchChange}
      onCategoryChange={handleCategoryChange}
      onRatingChange={handleRatingChange}
      onStatusChange={handleStatusChange}
      onStatusToggle={handleStatusToggle}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      onResetFilters={handleResetFilters}
      onExportPDF={handleExportPDF}
    />
  );
};

export default ProductTableContainer;
