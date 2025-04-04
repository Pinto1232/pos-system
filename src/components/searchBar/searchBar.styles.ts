import { styled } from '@mui/material/styles';
import { Paper, InputBase, IconButton } from '@mui/material';

export const StyledSearchBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 30,
  backgroundColor: '#fff',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(2, 3),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: '1rem',
}));

export const SearchIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));
