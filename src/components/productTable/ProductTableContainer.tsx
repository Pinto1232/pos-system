"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductTable from "./ProductTable";
import { Product } from "./types";
import { SelectChangeEvent } from "@mui/material/Select";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductTableContainer = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      image: "https://picsum.photos/200/200?random=1",
      name: "Wearables by Bose",
      color: "Black",
      idCode: "PID-5678",
      price: 55.89,
      status: true,
      rating: 5,
      createdAt: "2024-01-01"
    },
    {
      image: "https://picsum.photos/200/200?random=2",
      name: "Garmin Fenix 7X Solar zwart z...",
      color: "Black",
      idCode: "ITEM-4567",
      price: 45.88,
      status: true,
      rating: 3,
      createdAt: "2024-01-02"
    },
    {
      image: "https://picsum.photos/200/200?random=3",
      name: "Sony WH-1000XM4 Wireless",
      color: "Black",
      idCode: "ART-3456",
      price: 27.90,
      status: true,
      rating: 5,
      createdAt: "2024-01-03"
    },
    {
      image: "https://picsum.photos/200/200?random=4",
      name: "Apple Iphone 13 IBOX - RED, 51...",
      color: "Green",
      idCode: "GTIN-6789",
      price: 48.22,
      status: true,
      rating: 2,
      createdAt: "2024-01-04"
    },
    {
      image: "https://picsum.photos/200/200?random=5",
      name: "JBL Enceinte portable Bluetoot...",
      color: "Silver",
      idCode: "PROD-789",
      price: 78.29,
      status: true,
      rating: 1,
      createdAt: "2024-01-05"
    },
    {
      image: "https://picsum.photos/200/200?random=6",
      name: "Samsung Galaxy Buds 2 Green...",
      color: "White",
      idCode: "SKU-9876",
      price: 55.22,
      status: true,
      rating: 5,
      createdAt: "2024-01-06"
    },
    {
      image: "https://picsum.photos/200/200?random=7",
      name: "Faguo - Hazel Baskets Cuir Dai...",
      color: "White",
      idCode: "CAT-8901",
      price: 34.90,
      status: true,
      rating: 4,
      createdAt: "2024-01-07"
    },
    {
      image: "https://picsum.photos/200/200?random=8",
      name: "Lil' Atelier Strickweste",
      color: "Gold",
      idCode: "REF-1234",
      price: 89.89,
      status: true,
      rating: 1,
      createdAt: "2024-01-08"
    },
    {
      image: "https://picsum.photos/200/200?random=9",
      name: "Apple MacBook Pro 14-inch",
      color: "Space Gray",
      idCode: "MBP-5678",
      price: 2499.99,
      status: true,
      rating: 5,
      createdAt: "2024-01-09"
    },
    {
      image: "https://picsum.photos/200/200?random=10",
      name: "Apple AirPods Pro",
      color: "White",
      idCode: "AP-9012",
      price: 249.99,
      status: true,
      rating: 4,
      createdAt: "2024-01-10"
    },
    {
      image: "https://picsum.photos/200/200?random=11",
      name: "Apple iPad Pro 12.9-inch",
      color: "Silver",
      idCode: "IPD-3456",
      price: 1099.99,
      status: true,
      rating: 5,
      createdAt: "2024-01-11"
    },
    {
      image: "https://picsum.photos/200/200?random=12",
      name: "Sony PlayStation 5",
      color: "White",
      idCode: "PS5-1234",
      price: 499.99,
      status: false,
      rating: 5,
      createdAt: "2024-01-12"
    },
    {
      image: "https://picsum.photos/200/200?random=13",
      name: "Microsoft Xbox Series X",
      color: "Black",
      idCode: "XBX-5678",
      price: 499.99,
      status: false,
      rating: 4,
      createdAt: "2024-01-13"
    },
    {
      image: "https://picsum.photos/200/200?random=14",
      name: "Nintendo Switch OLED",
      color: "White",
      idCode: "NSW-9012",
      price: 349.99,
      status: false,
      rating: 4,
      createdAt: "2024-01-14"
    },
    {
      image: "https://picsum.photos/200/200?random=15",
      name: "NVIDIA GeForce RTX 4090",
      color: "Black",
      idCode: "GPU-4090",
      price: 1599.99,
      status: false,
      rating: 5,
      createdAt: "2024-01-15"
    },
    {
      image: "https://picsum.photos/200/200?random=16",
      name: "Apple Mac Studio",
      color: "Space Gray",
      idCode: "MCS-2023",
      price: 1999.99,
      status: false,
      rating: 5,
      createdAt: "2024-01-16"
    },
    {
      image: "https://picsum.photos/200/200?random=17",
      name: "Samsung Galaxy Z Fold 5",
      color: "Black",
      idCode: "ZFOLD-5",
      price: 1799.99,
      status: false,
      rating: 4,
      createdAt: "2024-01-17"
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>("R10-R100");
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
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.idCode === product.idCode
          ? { ...p, status: !p.status }
          : p
      )
    );
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
    setPriceFilter("R10-R100");
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
      `R${product.price.toFixed(2)}`,
      product.status ? 'In Stock' : 'Out of Stock',
      product.rating.toString(),
      product.color || 'N/A',
      new Date(product.createdAt).toLocaleDateString()
    ]);

    // Add the table
    autoTable(doc, {
      startY: 30,
      head: [['Product Name', 'ID Code', 'Price', 'Status', 'Rating', 'Color', 'Created At']],
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
        0: { cellWidth: 60, overflow: 'linebreak' },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 }
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
