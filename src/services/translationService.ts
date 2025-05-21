import axios from 'axios';

export const translationService = {
  getTranslations: async (language: string, namespace: string = 'common') => {
    try {
      const response = await axios.get(
        `/api/translations?language=${language}&namespace=${namespace}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  },

  translateDynamicContent: async <T extends Record<string, any>>(
    language: string,
    content: T,
    keys: (keyof T)[]
  ): Promise<T> => {
    try {
      const response = await axios.post('/api/translations/dynamic', {
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
