declare module 'next/cache' {
    export function unstable_cache<T>(
      cb: () => Promise<T>,
      keyParts: string[],
      options: { revalidate?: number | false; tags?: string[] }
    ): () => Promise<T>;
    
    export function revalidateTag(tag: string): Promise<void>;
    export function revalidatePath(path: string): Promise<void>;
  }