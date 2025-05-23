import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    suppressAuthErrors?: boolean;
  }
}
