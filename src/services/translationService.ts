import { apiClient } from '@/api/axiosClient';

export type TranslationValue = string | number | boolean | null | undefined;

export interface TranslationObject {
  [key: string]: TranslationValue | TranslationArray | TranslationObject;
}
export type TranslationArray = Array<
  TranslationValue | TranslationArray | TranslationObject
>;

export const translationService = {
  getTranslations: async (language: string, namespace: string = 'common') => {
    try {
      const response = await apiClient.get(
        `/api/translations?language=${language}&namespace=${namespace}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  },

  translateDynamicContent: async <
    T extends Record<
      string,
      TranslationValue | TranslationArray | TranslationObject
    >,
  >(
    language: string,
    content: T,
    keys: (keyof T)[]
  ): Promise<T> => {
    try {
      const response = await apiClient.post('/api/translations/dynamic', {
        language,
        content,
        keys,
      });
      return response.data;
    } catch (error) {
      console.error('Error translating dynamic content:', error);
      return content;
    }
  },
};

export default translationService;
