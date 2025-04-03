import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    width: '100%',
};

export const titleStyles: SxProps<Theme> = {
    mb: 3,
    fontWeight: 600,
    color: '#1a1a1a',
    fontSize: '1.5rem',
};

export const filtersWrapperStyles: SxProps<Theme> = {
    mb: 3,
    width: '100%',
    bgcolor: '#f8fafc',
    borderRadius: '12px',
    p: 3,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
};

export const filtersContainerStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    gap: 3,
    alignItems: 'center',
    flexWrap: 'wrap',
};

export const filtersBoxStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    minWidth: { xs: '100%', md: 'auto' },
};

export const searchFieldStyles: SxProps<Theme> = {
    minWidth: { xs: '100%', sm: 300 },
    '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        backgroundColor: 'white',
        '& fieldset': {
            borderColor: '#e2e8f0',
        },
        '&:hover fieldset': {
            borderColor: '#cbd5e1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#3b82f6',
            borderWidth: '1px',
        },
    },
    '& .MuiInputBase-input': {
        py: 1.5,
        px: 2,
        fontSize: '0.75rem',
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.75rem',
    },
};

export const selectStyles: SxProps<Theme> = {
    borderRadius: '6px',
    backgroundColor: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e8f0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#cbd5e1',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3b82f6',
        borderWidth: '1px',
    },
};

export const inputLabelStyles: SxProps<Theme> = {
    '&.Mui-focused': { color: '#3b82f6' },
    '&.MuiInputLabel-shrink': { color: '#3b82f6' },
    color: '#64748b',
};

export const actionsBoxStyles: SxProps<Theme> = {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    mt: { xs: 2, md: 0 },
};

export const resetButtonStyles: SxProps<Theme> = {
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    p: 1.5,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        transform: 'rotate(180deg)',
        borderColor: '#2563eb',
    },
};

export const exportButtonStyles: SxProps<Theme> = {
    bgcolor: '#3b82f6',
    color: 'white',
    px: 3,
    py: 1,
    borderRadius: '6px',
    '&:hover': {
        bgcolor: '#2563eb',
    },
};

export const tableCellStyles: SxProps<Theme> = {
    fontWeight: 600,
    color: '#64748b',
    fontSize: '0.875rem',
};

export const productImageStyles: SxProps<Theme> = {
    width: 40,
    height: 40,
    position: 'relative',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
};

export const statusTextStyles = (status: boolean): SxProps<Theme> => ({
    fontSize: '0.875rem',
    color: status ? '#22c55e' : 'error.main',
    fontWeight: 600,
});

export const switchStyles: SxProps<Theme> = {
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#173a79',
        '&:hover': {
            backgroundColor: 'rgba(23, 58, 121, 0.04)',
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#173a79',
    },
};

export const modalPaperStyles: SxProps<Theme> = {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'visible',
    maxWidth: 500,
    width: '100%',
    mx: 'auto',
    position: 'relative',
    pt: 8,
};

export const modalImageStyles: SxProps<Theme> = {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 120,
    height: 120,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #f0f0f0',
    mx: 'auto',
    mt: -8,
    mb: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    bgcolor: 'white',
};

export const modalTitleStyles: SxProps<Theme> = {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1a1a1a',
    pb: 2,
};

export const noProductsStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
};

export const noProductsTextStyles: SxProps<Theme> = {
    color: 'text.secondary',
    fontWeight: 500,
};

export const noProductsSubtextStyles: SxProps<Theme> = {
    color: 'text.secondary',
}; 