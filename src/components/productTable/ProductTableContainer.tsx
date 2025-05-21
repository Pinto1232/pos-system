'use client';

import React, { useState, useMemo, lazy, Suspense } from 'react';
import ProductTable from './ProductTable';
import { useProductContext } from '@/contexts/ProductContext';
import { Product } from '../productEdit/types';
import { SelectChangeEvent } from '@mui/material/Select';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Skeleton } from '@mui/material';

const VirtualizedProductTable = lazy(() => import('./VirtualizedProductTable'));

const ProductTableContainer: React.FC = () => {
  const { products, updateProduct } = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          (product.productName &&
            product.productName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (product.barcode &&
            product.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((product) => product.color === categoryFilter);
    }

    if (ratingFilter !== 'All') {
      const ratingValue = parseInt(ratingFilter);
      filtered = filtered.filter(
        (product) => Math.floor(product.rating || 0) === ratingValue
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((product) =>
        statusFilter === 'Available'
          ? product.status === true
          : product.status === false
      );
    }

    if (priceFilter !== 'All') {
      switch (priceFilter) {
        case 'R10-R100':
          filtered = filtered.filter(
            (product) => product.price >= 10 && product.price <= 100
          );
          break;
        case 'R100-R500':
          filtered = filtered.filter(
            (product) => product.price >= 100 && product.price <= 500
          );
          break;
        case 'R500-R1000':
          filtered = filtered.filter(
            (product) => product.price >= 500 && product.price <= 1000
          );
          break;
        case 'R1000+':
          filtered = filtered.filter((product) => product.price > 1000);
          break;
      }
    }

    return filtered;
  }, [
    products,
    searchQuery,
    categoryFilter,
    ratingFilter,
    statusFilter,
    priceFilter,
  ]);

  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, rowsPerPage]);

  const handleView = (product: Product) => {
    console.log(
      'ProductTableContainer - handleView called with product:',
      JSON.stringify(product, null, 2)
    );
    if (!product) {
      console.error(
        'ProductTableContainer - handleView called with null/undefined product'
      );
      return;
    }

    const completeProduct = {
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
    } as Product;

    console.log(
      'ProductTableContainer - Opening modal with complete product data:',
      JSON.stringify(completeProduct, null, 2)
    );

    setSelectedProduct(completeProduct);
    setTimeout(() => {
      setIsViewModalOpen(true);
      console.log(
        'ProductTableContainer - Modal should now be open, isViewModalOpen:',
        JSON.stringify(true, null, 2)
      );
    }, 0);
  };

  const handleCloseModal = () => {
    console.log('ProductTableContainer - handleCloseModal called');
    setIsViewModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      console.log('ProductTableContainer - Modal closed and product reset');
    }, 100);
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
    const updatedProduct = {
      ...product,
      status: !product.status,
      statusProduct: !product.status ? 'Active' : 'Inactive',
    };

    updateProduct(updatedProduct);

    try {
      const storedData = localStorage.getItem('products');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          const updatedProducts = parsedData.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          );
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          console.log(
            'ProductTableContainer - Updated product status in localStorage'
          );
        }
      }
    } catch (error) {
      console.error(
        'Failed to update product status in localStorage:',
        JSON.stringify(error, null, 2)
      );
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setRatingFilter('All');
    setStatusFilter('All');
    setPriceFilter('All');
    setPage(0);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    doc.setFontSize(16);
    doc.text('Product List', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableData = filteredProducts.map((product) => [
      product.productName,
      product.barcode,
      product.sku || '-',
      `R${product.price.toFixed(2)}`,
      product.status ? 'In Stock' : 'Out of Stock',
      product.rating.toString(),
      product.color || 'N/A',
      new Date(product.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          'Product Name',
          'ID Code',
          'SKU',
          'Price',
          'Status',
          'Rating',
          'Color',
          'Created At',
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 3,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: {
          cellWidth: 50,
          overflow: 'linebreak',
        },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 },
      },
      margin: { left: 10, right: 10 },
      tableWidth: 'auto',
      horizontalPageBreak: true,
      showHead: 'everyPage',
      pageBreak: 'auto',
    });

    doc.save('product-list.pdf');
  };

  const getPriceFilterRange = (priceFilterValue: string): [number, number] => {
    switch (priceFilterValue) {
      case 'R10-R100':
        return [10, 100];
      case 'R100-R500':
        return [100, 500];
      case 'R500-R1000':
        return [500, 1000];
      case 'R1000+':
        return [1000, 10000];
      default:
        return [0, 10000];
    }
  };

  const shouldUseVirtualization = useMemo(() => {
    return filteredProducts.length > 100;
  }, [filteredProducts.length]);

  return (
    <>
      {shouldUseVirtualization ? (
        <Suspense fallback={<Skeleton variant="rectangular" height={500} />}>
          <VirtualizedProductTable
            products={filteredProducts}
            selectedProduct={selectedProduct}
            isViewModalOpen={isViewModalOpen}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            ratingFilter={
              ratingFilter !== 'All' ? parseInt(ratingFilter, 10) : 0
            }
            statusFilter={statusFilter}
            priceFilter={getPriceFilterRange(priceFilter)}
            onView={handleView}
            isLoading={false}
          />
        </Suspense>
      ) : (
        <ProductTable
          products={paginatedProducts}
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
      )}
    </>
  );
};

export default ProductTableContainer;
