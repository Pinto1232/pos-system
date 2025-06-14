import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  width: '100%',
};

export const titleStyles: SxProps<Theme> = {
  mb: { xs: 2, sm: 3 },
  fontWeight: 600,
  color: '#1a1a1a',
  fontSize: { xs: '1.25rem', sm: '1.5rem' },
};

export const filtersWrapperStyles: SxProps<Theme> = {
  mb: { xs: 2, sm: 3 },
  width: '100%',
  bgcolor: '#f8fafc',
  borderRadius: '12px',
  p: { xs: 2, sm: 3 },
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  position: 'relative',

  transition: 'margin-left 0.3s ease',
};

export const filtersContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: { xs: 'flex-start', sm: 'space-between' },
  gap: { xs: 2, sm: 2, md: 3 },
  alignItems: { xs: 'stretch', sm: 'flex-start', md: 'center' },
  flexWrap: 'wrap',
  width: '100%',
};

export const filtersBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 2, sm: 2, md: 3 },
  alignItems: { xs: 'stretch', sm: 'flex-start', md: 'center' },
  flexWrap: 'wrap',
  flex: 1,
  minWidth: { xs: '100%', sm: 'auto' },
  position: 'relative',
  '& > *': {
    position: 'relative',
  },

  justifyContent: { sm: 'flex-start' },
  width: '100%',
};

export const searchFieldStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    height: { xs: 36, sm: 40 },
    backgroundColor: 'white',
    cursor: 'pointer',
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
    '& .MuiInputBase-input': {
      py: { xs: 0.75, sm: 1, md: 1.5 },
      px: { xs: 0.5, sm: 0.75 },
      fontSize: { xs: '0.7rem', sm: '0.75rem' },
      cursor: 'text',
      '&::placeholder': {
        opacity: 0.7,
        color: '#64748b',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '0.7rem', sm: '0.75rem' },
    },
    '& .MuiInputAdornment-root': {
      marginRight: { xs: -0.5, sm: 0 },
      marginLeft: { xs: 0.5, sm: 0.75 },
      '& .MuiSvgIcon-root': {
        fontSize: { xs: '1rem', sm: '1.25rem' },
      },
    },
  },
  width: '100%',
  maxWidth: { xs: '100%', sm: '100%', md: 300 },
  minWidth: { xs: '100%', sm: 150 },
};

export const selectStyles: SxProps<Theme> = {
  minWidth: { xs: '100%', sm: 150, md: 180 },
  backgroundColor: 'white',
  position: 'relative',
  cursor: 'pointer',
  '& .MuiSelect-select': {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    py: { xs: 0.75, sm: 1, md: 1.5 },
    px: { xs: 1, sm: 1.5 },
    cursor: 'pointer',

    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minHeight: { xs: '1.4375em', sm: '1.4375em' },
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiInputLabel-root': {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#cbd5e1',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3b82f6',
  },

  '& .MuiSelect-icon': {
    pointerEvents: 'none',
    color: '#64748b',
    right: { xs: 4, sm: 7 },
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
  },
  '& .MuiTouchRipple-root': {
    color: '#3b82f6',
  },
  '&.MuiOutlinedInput-root': {
    height: { xs: 36, sm: 40 },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    },
  },

  width: '100%',
  height: '100%',
};

export const inputLabelStyles: SxProps<Theme> = {
  '&.Mui-focused': { color: '#3b82f6' },
  color: '#64748b',
  fontSize: { xs: '0.7rem', sm: '0.75rem' },
  cursor: 'pointer',

  transform: 'translate(14px, 12px) scale(1)',
  '&.MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
    color: '#3b82f6',
  },

  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  padding: '0 4px',
};

export const actionsBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'row', sm: 'row' },
  gap: { xs: 1, sm: 2 },
  alignItems: 'center',
  justifyContent: { xs: 'flex-end', sm: 'flex-end' },
  width: { xs: '100%', sm: 'auto' },
  mt: { xs: 2, sm: 0 },
  flexWrap: 'nowrap',
  minWidth: { xs: 'auto', sm: 'auto' },
};

export const resetButtonStyles: SxProps<Theme> = {
  color: '#173a79',
  border: '1px solid #173a79',
  borderRadius: '8px',
  p: { xs: 0.75, sm: 1, md: 1.5 },
  minWidth: { xs: 36, sm: 40 },
  height: { xs: 36, sm: 40 },
  fontSize: { xs: '0.7rem', sm: '0.75rem' },
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(23, 58, 121, 0.08)',
    transform: 'rotate(180deg)',
    borderColor: '#1e4b9e',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const exportButtonStyles: SxProps<Theme> = {
  bgcolor: '#173a79',
  color: 'white',
  px: { xs: 1.5, sm: 2, md: 3 },
  py: { xs: 0.75, sm: 1, md: 1.5 },
  fontSize: { xs: '0.7rem', sm: '0.75rem' },
  borderRadius: '6px',
  minHeight: { xs: 36, sm: 40 },
  whiteSpace: 'nowrap',
  '&:hover': {
    bgcolor: '#1e4b9e',
  },
  '& .MuiButton-startIcon': {
    marginRight: { xs: 0.5, sm: 1 },
  },
};

export const tableCellStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: '#1E2A3B',
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  py: { xs: 1.5, sm: 2 },
  px: { xs: 1, sm: 1.5, md: 2 },
  borderBottom: '1px solid #E0E0E0',
  whiteSpace: 'nowrap',
  position: 'sticky',
  top: 0,
  backgroundColor: '#f8f9fa',
  zIndex: 10,
};

export const productImageStyles: SxProps<Theme> = {
  width: { xs: 32, sm: 40 },
  height: { xs: 32, sm: 40 },
  position: 'relative',
  borderRadius: '6px',
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

export const statusTextStyles = (status: boolean): SxProps<Theme> => ({
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  color: status ? '#22c55e' : '#d32f2f',
  fontWeight: 600,
  ml: 0.5,
});

export const switchStyles: SxProps<Theme> = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#52B788',
    '&:hover': {
      backgroundColor: 'rgba(82, 183, 136, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#52B788',
  },
  transform: { xs: 'scale(0.8)', sm: 'scale(1)' },
  mr: 0.5,
};

export const modalPaperStyles: SxProps<Theme> = {
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  overflow: 'visible',
  maxWidth: { xs: '90%', sm: 500 },
  width: '100%',
  mx: 'auto',
  position: 'relative',
  pt: { xs: 6, sm: 8 },
  backgroundColor: '#ffffff !important',
  display: 'block !important',
  opacity: 1,
  visibility: 'visible',
};

export const modalImageStyles: SxProps<Theme> = {
  position: 'absolute',
  top: { xs: -40, sm: -60 },
  left: '50%',
  transform: 'translateX(-50%)',
  width: { xs: 80, sm: 120 },
  height: { xs: 80, sm: 120 },
  borderRadius: '50%',
  overflow: 'hidden',
  border: '2px solid #f0f0f0',
  mx: 'auto',
  mt: { xs: -6, sm: -8 },
  mb: { xs: 1, sm: 2 },
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  bgcolor: 'white',
};

export const modalTitleStyles: SxProps<Theme> = {
  textAlign: 'center',
  fontSize: { xs: '1.25rem', sm: '1.5rem' },
  fontWeight: 600,
  color: '#1a1a1a',
  pb: { xs: 1, sm: 2 },
};

export const noProductsStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1,
  p: { xs: 2, sm: 3 },
};

export const noProductsTextStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 500,
  fontSize: { xs: '0.875rem', sm: '1rem' },
  textAlign: 'center',
};

export const noProductsSubtextStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  textAlign: 'center',
};
