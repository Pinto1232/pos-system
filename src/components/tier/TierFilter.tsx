import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface TierFilterProps {
  selectedTiers: number[];
  onTierChange: (tiers: number[]) => void;
  availableTiers: Array<{
    level: number;
    name: string;
    description: string;
  }>;
}

const TierFilter: React.FC<TierFilterProps> = ({
  selectedTiers,
  onTierChange,
  availableTiers,
}) => {
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    onTierChange(typeof value === 'string' ? [] : value);
  };

  const getTierColor = (level: number) => {
    switch (level) {
      case 1:
        return '#4caf50';
      case 2:
        return '#2196f3';
      case 3:
        return '#9c27b0';
      case 4:
        return '#f44336';
      case 5:
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ minWidth: 200, mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="tier-filter-label">Filter by Tier</InputLabel>
        <Select
          labelId="tier-filter-label"
          id="tier-filter"
          multiple
          value={selectedTiers}
          onChange={handleChange}
          label="Filter by Tier"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                return (
                  <Chip
                    key={value}
                    label={`Tier ${value}`}
                    size="small"
                    style={{
                      backgroundColor: getTierColor(value),
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  />
                );
              })}
            </Box>
          )}
        >
          <MenuItem value="">
            <em>All Tiers</em>
          </MenuItem>
          {availableTiers.map((tier) => (
            <MenuItem key={tier.level} value={tier.level}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`Tier ${tier.level}`}
                  size="small"
                  style={{
                    backgroundColor: getTierColor(tier.level),
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {tier.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tier.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TierFilter;
