// useData.d.ts
declare module '@hooks/useData' {
  import { UseQueryResult } from '@tanstack/react-query'; 

  interface DataItem {
    id: number;
    name: string;
  }

  export function useData(): UseQueryResult<DataItem[], Error>;
}
