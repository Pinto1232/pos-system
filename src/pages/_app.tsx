// src/pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@services/store/store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;