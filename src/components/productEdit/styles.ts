import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Paper,
} from '@mui/material';

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 360px',
  gap: '24px',
  padding: '24px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  '@media (max-width: 1200px)': {
    gridTemplateColumns: '1fr',
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
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
  position: 'sticky',
  top: '24px',
  '@media (max-width: 1200px)': {
    position: 'static',
  },
});

export const HeaderSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

export const ButtonGroup = styled(Box)({
  display: 'flex',
  gap: '8px',
  width: '100%',
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
  '&:hover': {
    borderColor: '#1E2A3B',
    backgroundColor: 'transparent',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
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
  fontSize: '15px',
  borderRadius: '1',
  padding: '5px',
  '&:hover': {
    backgroundColor: '#429670',
  },
});

export const ProductTable = styled(Box)({
  width: '100%',
  '& .MuiDataGrid-root': {
    border: 'none',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
    maxWidth: '100%',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E0E0E0',
    minHeight: '56px !important',
    maxHeight: '56px !important',
    lineHeight: '56px',
    '& .MuiDataGrid-columnHeader': {
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #E0E0E0',
    color: '#1E2A3B',
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiCheckbox-root': {
    color: '#1E2A3B',
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
  marginTop: '-26px',
  marginBottom: '8px',
  borderBottom: '1px solid #1E2A3B',
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
});

export const BarcodeCell = styled(HeaderCell)({
  flex: 1,
  minWidth: '130px',
});

export const ProductNameCell = styled(HeaderCell)(
  {
    flex: 2,
    minWidth: '200px',
  }
);

export const StandardCell = styled(HeaderCell)({
  flex: 1,
  minWidth: '100px',
});

export const HeaderWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
  width: '100%',
});
