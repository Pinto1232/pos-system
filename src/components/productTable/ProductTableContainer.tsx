'use client';

import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import ProductTable from './ProductTable';
import { useProductContext } from '@/contexts/ProductContext';
import { Product } from '../productEdit/types';
import { ProductCategory } from '../productCategories/types';
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
  const [salesFilter, setSalesFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem('productCategories');
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
  }, []);

  const categoryNames = useMemo(() => {
    const activeCategories = categories.filter(
      (cat) => cat.isActive && !cat.parentId
    );
    return ['All', ...activeCategories.map((cat) => cat.name)];
  }, [categories]);

  console.log('Available categories:', categoryNames);

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
      filtered = filtered.filter(
        (product) =>
          product.category === categoryFilter ||
          product.color === categoryFilter
      );
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

    if (salesFilter !== 'All') {
      const salesCount = (product: Product) => product.salesCount || 0;
      const returnCount = (product: Product) => product.returnCount || 0;

      switch (salesFilter) {
        case 'Best Selling':
          filtered = filtered.filter((product) => salesCount(product) >= 50);
          break;
        case 'Most Returned':
          filtered = filtered.filter((product) => {
            const sales = salesCount(product);
            const returns = returnCount(product);
            const returnRate = sales > 0 ? (returns / sales) * 100 : 0;
            return returnRate >= 20;
          });
          break;
        case 'Never Sold':
          filtered = filtered.filter((product) => salesCount(product) === 0);
          break;
        case 'Low Sales':
          filtered = filtered.filter((product) => {
            const sales = salesCount(product);
            return sales > 0 && sales < 10;
          });
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
    salesFilter,
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

  const handleSalesChange = (event: SelectChangeEvent) => {
    setSalesFilter(event.target.value);
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
    setSalesFilter('All');
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
      `${product.salesCount || 0}`,
      product.lastSoldDate
        ? new Date(product.lastSoldDate).toLocaleDateString()
        : 'Never sold',
      product.status ? 'In Stock' : 'Out of Stock',
      product.rating.toString(),
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
          'Sales Count',
          'Last Sold',
          'Status',
          'Rating',
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
          cellWidth: 40,
          overflow: 'linebreak',
        },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 18 },
        4: { cellWidth: 18 },
        5: { cellWidth: 22 },
        6: { cellWidth: 18 },
        7: { cellWidth: 15 },
        8: { cellWidth: 22 },
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
          salesFilter={salesFilter}
          onView={handleView}
          onCloseModal={handleCloseModal}
          onPriceChange={handlePriceChange}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onRatingChange={handleRatingChange}
          onStatusChange={handleStatusChange}
          onSalesChange={handleSalesChange}
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
