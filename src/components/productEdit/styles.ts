import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Paper,
} from '@mui/material';

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 340px', // Increased from 320px to 340px
  gap: '28px',
  padding: '28px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  '@media (max-width: 1200px)': {
    gridTemplateColumns: '1fr',
  },
  '@media (max-width: 768px)': {
    padding: '20px',
    gap: '20px',
  },
  '@media (max-width: 480px)': {
    padding: '16px',
    gap: '16px',
  },
});

export const ProductListSection = styled(Box)({
  minWidth: '0',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const TotalSection = styled(Paper)({
  width: '100%',
  height: 'fit-content',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
  position: 'sticky',
  top: '24px',
  border: '1px solid rgba(0, 0, 0, 0.03)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  },
  '@media (max-width: 1200px)': {
    position: 'static',
  },
  '@media (max-width: 768px)': {
    padding: '24px',
    gap: '20px',
  },
  '@media (max-width: 480px)': {
    padding: '20px',
    gap: '16px',
  },
});

export const HeaderSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

export const ButtonGroup = styled(Box)({
  display: 'flex',
  gap: '10px',
  width: '100%',
  marginBottom: '16px',
  '@media (max-width: 768px)': {
    flexWrap: 'wrap',
    gap: '10px',
  },
  '@media (max-width: 480px)': {
    flexDirection: 'column',
    gap: '8px',
  },
});

export const AddItemButton = styled(Button)({
  flex: 4,
  padding: '16px',
  backgroundColor: '#1E2A3B',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '15px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#2C3E50',
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
});

export const ExportButton = styled(Button)({
  textTransform: 'none',
  color: '#1E2A3B',
  borderColor: '#E0E0E0',
  padding: '8px 16px',
  fontWeight: 500,
  fontSize: '14px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #E0E0E0',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#1E2A3B',
    backgroundColor: '#e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    marginRight: '6px',
  },
  '@media (max-width: 480px)': {
    padding: '6px 12px',
    fontSize: '13px',
  },
});

export const ActionButton = styled(Button)({
  width: '100%',
  padding: '12px',
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '8px',
});

export const CollectPaymentButton = styled(
  ActionButton
)({
  backgroundColor: '#52B788',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  padding: '14px',
  boxShadow: '0 4px 12px rgba(82, 183, 136, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#429670',
    boxShadow:
      '0 6px 16px rgba(82, 183, 136, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow:
      '0 2px 8px rgba(82, 183, 136, 0.2)',
  },
});

export const ProductTable = styled(Box)({
  width: '100%',
  overflowX: 'auto',
  position: 'relative',
  zIndex: 1,
  '& .MuiDataGrid-root': {
    border: 'none',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E0E0E0',
    minHeight: '56px !important',
    maxHeight: '56px !important',
    lineHeight: '56px',
    '& .MuiDataGrid-columnHeader': {
      fontWeight: 600,
      padding: '0 16px',
      '& .MuiDataGrid-columnHeaderTitleContainer':
        {
          padding: '0 8px',
        },
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 600,
      color: '#1E2A3B',
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #E0E0E0',
    color: '#1E2A3B',
    fontSize: '14px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-within': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: '#F8F9FA',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(82, 183, 136, 0.08)',
      '&:hover': {
        backgroundColor:
          'rgba(82, 183, 136, 0.12)',
      },
    },
  },
  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell':
    {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell:first-of-type':
    {
      borderBottomLeftRadius: 0,
    },
  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell:last-of-type':
    {
      borderBottomRightRadius: 0,
    },
  '& .MuiCheckbox-root': {
    color: '#1E2A3B',
    padding: '4px',
  },
  '& .MuiDataGrid-virtualScroller': {
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '4px',
      '&:hover': {
        background: '#a8a8a8',
      },
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #E0E0E0',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
});

export const EmptyStateWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '400px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
});

export const EmptyStateIcon = styled(Box)({
  width: '120px',
  height: '120px',
  backgroundColor: '#A5F3D0',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  '& svg': {
    color: '#fff',
    fontSize: '48px',
  },
});

export const NewSessionButton = styled(Button)({
  flex: 1,
  backgroundColor: '#52B788',
  color: '#fff',
  textTransform: 'none',
  padding: '16px',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '15px',
  '&:hover': {
    backgroundColor: '#429670',
  },
  '& .MuiSvgIcon-root': {
    marginRight: '8px',
  },
});

export const QrCodeButton = styled(Button)({
  padding: '16px',
  minWidth: '56px',
  maxWidth: '56px',
  backgroundColor: '#52B788',
  color: '#fff',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#429670',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
});

export const TableHeaderRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  height: '48px',
  backgroundColor: '#f5f5f5',
  marginTop: '0',
  marginBottom: '12px',
  borderBottom: '1px solid #1E2A3B',
  borderRadius: '8px 8px 0 0',
  '& > *': {
    color: '#1E2A3B',
    fontSize: '14px',
    fontWeight: 600,
  },
});

export const HeaderCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const CheckboxCell = styled(HeaderCell)({
  width: '70px',
  justifyContent: 'center',
});

export const BarcodeCell = styled(HeaderCell)({
  flex: 1,
  minWidth: '130px',
});

export const ProductNameCell = styled(HeaderCell)(
  {
    flex: 1.8,
    minWidth: '160px',
  }
);

export const StandardCell = styled(HeaderCell)({
  flex: 0.8,
  minWidth: '90px',
});

export const HeaderWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
  width: '100%',
  '@media (max-width: 768px)': {
    padding: '14px 16px',
  },
  '@media (max-width: 480px)': {
    padding: '12px 14px',
  },
});
