import React, { useEffect, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { ProductTableProps, Product } from './types';
import { useProductContext } from '@/contexts/ProductContext';
import { containerStyles } from './styles';
import { fuzzySearchAndSort } from '@/utils/fuzzySearch';

import TableHeader from './components/TableHeader';
import ProductTableView from './components/ProductTableView';
import ProductDetailsModal from './components/ProductDetailsModal';
import StockSummary from './components/StockSummary';

const categories = [
  'All',
  'Black',
  'White',
  'Green',
  'Silver',
  'Gold',
  'Space Gray',
];
const ratings = ['All', '5', '4', '3', '2', '1'];
const statuses = ['All', 'Available', 'Out of Stock'];
const prices = ['All', 'R10-R100', 'R100-R500', 'R500-R1000', 'R1000+'];
const salesCategories = [
  'All',
  'Best Selling',
  'Most Returned',
  'Never Sold',
  'Low Sales',
];

const ProductTable: React.FC<ProductTableProps> = ({
  products: propProducts,
  selectedProduct,
  isViewModalOpen,
  page,
  rowsPerPage,
  searchQuery,
  categoryFilter,
  ratingFilter,
  statusFilter,
  priceFilter,
  salesFilter,
  onView,
  onCloseModal,
  onPriceChange,
  onSearchChange,
  onCategoryChange,
  onRatingChange,
  onStatusChange,
  onSalesChange,
  onStatusToggle,
  onPageChange,
  onRowsPerPageChange,
  onResetFilters,
  onExportPDF,
  onDeleteProduct,
  onAddToCart,
  showStockWarnings = true,
}) => {
  const { products: contextProducts } = useProductContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  useEffect(() => {
    let localStorageProducts: Product[] = [];
    try {
      const storedData = localStorage.getItem('products');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          localStorageProducts = parsedData;
          console.log(
            'ProductTable - Loaded products from localStorage:',
            JSON.stringify(localStorageProducts.length, null, 2)
          );
        }
      }
    } catch (error) {
      console.error(
        'Failed to load products from localStorage:',
        JSON.stringify(error, null, 2)
      );
    }

    const sourceProducts =
      localStorageProducts.length > 0
        ? localStorageProducts
        : contextProducts && contextProducts.length > 0
          ? contextProducts
          : propProducts || [];

    const normalizedProducts = sourceProducts.map((product) => ({
      ...product,
      id: product.id || 0,
      productName: product.productName || 'Unknown Product',
      barcode: product.barcode || 'N/A',
      sku: product.sku || '-',
      price: typeof product.price === 'number' ? product.price : 0,
      status: typeof product.status === 'boolean' ? product.status : false,
      rating: typeof product.rating === 'number' ? product.rating : 0,
      createdAt: product.createdAt || new Date().toISOString(),
      color: product.color || 'N/A',
      statusProduct: product.status ? 'Active' : 'Inactive',
      image: product.image || '/placeholder-image.png',

      salesCount:
        typeof product.salesCount === 'number'
          ? product.salesCount
          : Math.floor(Math.random() * 100),
      returnCount:
        typeof product.returnCount === 'number'
          ? product.returnCount
          : Math.floor(Math.random() * 10),
      lastSoldDate:
        product.lastSoldDate ||
        (Math.random() > 0.3
          ? new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString()
          : null),
      totalRevenue:
        typeof product.totalRevenue === 'number'
          ? product.totalRevenue
          : (product.salesCount || 0) * (product.price || 0),
    }));

    let searchFilteredProducts = normalizedProducts;
    if (searchQuery && searchQuery.trim().length > 0) {
      console.log('Applying fuzzy search for query:', searchQuery);

      const searchResults = fuzzySearchAndSort(
        normalizedProducts,
        searchQuery,
        (product) => [
          product.productName || '',
          product.barcode || '',
          product.sku || '',
        ],
        0.1 // Minimum score threshold
      );

      searchFilteredProducts = searchResults;
      console.log(
        `Fuzzy search results: ${searchResults.length} products found`
      );

      // Log top matches for debugging
      if (searchResults.length > 0) {
        console.log(
          'Top search matches:',
          searchResults.slice(0, 3).map((p) => ({
            name: p.productName,
            barcode: p.barcode,
            score: p.searchScore?.toFixed(3),
          }))
        );
      }
    }

    // Apply other filters
    const updatedFilteredProducts = searchFilteredProducts.filter((product) => {
      // Filter by category (color)
      if (categoryFilter !== 'All' && product.color !== categoryFilter)
        return false;

      if (
        ratingFilter !== 'All' &&
        Math.floor(product.rating || 0) !== parseInt(ratingFilter, 10)
      )
        return false;

      if (statusFilter !== 'All') {
        const currentStatus = product.status ? 'Available' : 'Out of Stock';
        if (currentStatus !== statusFilter) return false;
      }

      if (priceFilter !== 'All') {
        const price = product.price || 0;
        switch (priceFilter) {
          case 'R10-R100':
            if (price < 10 || price > 100) return false;
            break;
          case 'R100-R500':
            if (price < 100 || price > 500) return false;
            break;
          case 'R500-R1000':
            if (price < 500 || price > 1000) return false;
            break;
          case 'R1000+':
            if (price < 1000) return false;
            break;
        }
      }

      if (salesFilter !== 'All') {
        const salesCount = product.salesCount || 0;
        const returnCount = product.returnCount || 0;
        const returnRate =
          salesCount > 0 ? (returnCount / salesCount) * 100 : 0;

        switch (salesFilter) {
          case 'Best Selling':
            if (salesCount < 50) return false;
            break;
          case 'Most Returned':
            if (returnRate < 20) return false;
            break;
          case 'Never Sold':
            if (salesCount > 0) return false;
            break;
          case 'Low Sales':
            if (salesCount === 0 || salesCount >= 10) return false;
            break;
        }
      }
      return true;
    });

    setDisplayProducts(updatedFilteredProducts);
  }, [
    contextProducts,
    propProducts,
    searchQuery,
    categoryFilter,
    ratingFilter,
    statusFilter,
    priceFilter,
    salesFilter,
  ]);

  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return displayProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [displayProducts, page, rowsPerPage]);

  useEffect(() => {
    console.log(
      'Modal state changed - isViewModalOpen:',
      isViewModalOpen,
      'selectedProduct:',
      JSON.stringify(selectedProduct, null, 2)
    );
    if (isViewModalOpen && selectedProduct) {
      console.log(
        'MODAL DEBUG: Product data available for modal:',
        JSON.stringify(selectedProduct, null, 2)
      );
    } else if (isViewModalOpen) {
      console.error('MODAL DEBUG: Product data missing when modal opened');
    }
  }, [isViewModalOpen, selectedProduct]);

  return (
    <Box sx={containerStyles}>
      {}
      {showStockWarnings && <StockSummary products={displayProducts} />}

      {}
      <TableHeader
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        ratingFilter={ratingFilter}
        statusFilter={statusFilter}
        priceFilter={priceFilter}
        salesFilter={salesFilter}
        categories={categories}
        ratings={ratings}
        statuses={statuses}
        prices={prices}
        salesCategories={salesCategories}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onRatingChange={onRatingChange}
        onStatusChange={onStatusChange}
        onPriceChange={onPriceChange}
        onSalesChange={onSalesChange}
        onResetFilters={onResetFilters}
        onExportPDF={onExportPDF}
      />

      {}
      <ProductTableView
        paginatedProducts={paginatedProducts}
        displayProducts={displayProducts}
        page={page}
        rowsPerPage={rowsPerPage}
        onView={onView}
        onStatusToggle={onStatusToggle}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDeleteProduct={onDeleteProduct}
        onAddToCart={onAddToCart}
        showStockWarnings={showStockWarnings}
      />

      {}
      <ProductDetailsModal
        isOpen={isViewModalOpen}
        product={selectedProduct}
        onClose={onCloseModal}
      />
    </Box>
  );
};

export default ProductTable;
