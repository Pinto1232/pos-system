// src/services/store/store.d.ts
declare module '@services/store/store' {
    import { Store } from 'redux';
    import { RootState as RS } from '@services/store/types';
  
    const store: Store;
    export default store;
    export type RootState = RS;
  }