import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { fuzzySearchAndSort } from '@/utils/fuzzySearch';

interface DemoProduct {
  id: number;
  name: string;
  barcode: string;
  sku: string;
}

const demoProducts: DemoProduct[] = [
  {
    id: 1,
    name: 'iPhone 12 Pro Max',
    barcode: '123456789012',
    sku: 'APL-IP12PM-256',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S21',
    barcode: '234567890123',
    sku: 'SAM-GS21-128',
  },
  {
    id: 3,
    name: 'iPad Pro 11 inch',
    barcode: '345678901234',
    sku: 'APL-IPAD11-256',
  },
  {
    id: 4,
    name: 'MacBook Air M1',
    barcode: '456789012345',
    sku: 'APL-MBA-M1-256',
  },
  { id: 5, name: 'AirPods Pro', barcode: '567890123456', sku: 'APL-APP-PRO' },
  {
    id: 6,
    name: 'iPhone 13 Mini',
    barcode: '678901234567',
    sku: 'APL-IP13M-128',
  },
  { id: 7, name: 'Surface Pro 8', barcode: '789012345678', sku: 'MS-SP8-256' },
  {
    id: 8,
    name: 'Google Pixel 6',
    barcode: '890123456789',
    sku: 'GOO-PIX6-128',
  },
];

const SearchDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    Array<DemoProduct & { searchScore: number }>
  >([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuzzySearchAndSort(
      demoProducts,
      searchQuery,
      (product) => [product.name, product.barcode, product.sku],
      0.1
    );

    setResults(searchResults);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'success';
    if (score >= 0.7) return 'primary';
    if (score >= 0.5) return 'warning';
    return 'default';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.7) return 'Good';
    if (score >= 0.5) return 'Fair';
    return 'Poor';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Fuzzy Search Demo
      </Typography>

      <TextField
        fullWidth
        label="Search products by name, barcode, or SKU"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Try: iPhone, 123456, iPad, iPhon (with typo), etc."
        sx={{ mb: 3 }}
      />

      {query && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Search Results for &quot;{query}&quot; ({results.length} found)
          </Typography>

          {results.length > 0 ? (
            <List>
              {results.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant="subtitle1">
                            {product.name}
                          </Typography>
                          <Chip
                            label={`${getScoreLabel(product.searchScore)} (${(product.searchScore * 100).toFixed(0)}%)`}
                            color={getScoreColor(product.searchScore)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Barcode: {product.barcode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {product.sku}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No products found matching &quot;{query}&quot;
            </Typography>
          )}
        </Paper>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Try these examples:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[
            'iPhone',
            'iPad',
            '123456789012',
            'APL-IP12PM',
            'iPhon',
            'Galxy',
            'Pro Max',
          ].map((example) => (
            <Chip
              key={example}
              label={example}
              onClick={() => handleSearch(example)}
              clickable
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchDemo;
