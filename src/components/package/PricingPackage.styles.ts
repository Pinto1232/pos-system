import { SxProps } from '@mui/material';

export const pricingPackageStyles = {
  card: {
    maxWidth: 299,
    maxHeight: 545,
    paddingBottom: '27%',
    margin: '8px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#D1D5DB',
  } as SxProps,
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: '8px',
    borderRadius: '5px 5px 0 0',
  } as SxProps,
  titleText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '8px',
    fontFamily: 'Inter, sans-serif',
  } as SxProps,
  description: {
    color: '#333',
    marginBottom: '16px',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    height: '50px',
  } as SxProps,
  buyButtonBox: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '16px',
    fontSize: '17px',
    borderRadius: '4px'
  } as SxProps,
  icon: {
    fontSize: '23px',
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