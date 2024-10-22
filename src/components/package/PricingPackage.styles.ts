import { SxProps } from '@mui/material';

export const pricingPackageStyles = {
  card: {
    maxWidth: 275,
    margin: '8px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f5f5f5',
  } as SxProps,
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: '2px',
    borderRadius: '5px 5px 0 0',
  } as SxProps,
  titleText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '8px',
  } as SxProps,
  description: {
    color: '#333',
    marginBottom: '16px',
  } as SxProps,
  buyButtonBox: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '16px',
  } as SxProps,
  icon: {
    fontSize: '25px',
    color: '#fff',
  } as SxProps,
  heading: {
    textAlign: 'center',
    marginBottom: '16px',
    color: '#000',
    fontWeight: 'bold',
    marginTop: '17px',
    fontFamily: 'Inter, sans-serif', 
    fontSize: '27px',
  } as SxProps,
};