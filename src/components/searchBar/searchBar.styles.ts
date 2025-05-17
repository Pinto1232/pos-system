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
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1, 1),
    padding: theme.spacing(0.75, 1.5),
    borderRadius: 20,
  },
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: '1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
    marginLeft: theme.spacing(0.25),
  },
}));

export const SearchIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
}));
