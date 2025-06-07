import { AVAILABLE_LANGUAGES } from '@/i18n';

interface ValidationResult {
  language: string;
  code: string;
  missingKeys: string[];
  isValid: boolean;
  totalKeys: number;
  translatedKeys: number;
}


const REQUIRED_FOOTER_KEYS = [
  'subscription.title',
  'subscription.subtitle',
  'subscription.placeholder',
  'subscription.button',
  'footer.company',
  'footer.home',
  'footer.services',
  'footer.about',
  'footer.contact',
  'footer.tel1',
  'footer.tel2',
  'footer.email1',
  'footer.email2',
  'footer.office',
  'footer.address1',
  'footer.address2',
  'footer.address3',
  'footer.followUs',
  'footer.privacy',
  'footer.copyright',
];




export function validateTranslationKeys(
  translations: any,
  languageCode: string
): ValidationResult {
  const missingKeys: string[] = [];

  for (const key of REQUIRED_FOOTER_KEYS) {
    const keyParts = key.split('.');
    let current = translations;

    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        missingKeys.push(key);
        break;
      }
    }
  }

  const language = AVAILABLE_LANGUAGES.find(
    (lang) => lang.code === languageCode
  );

  return {
    language: language?.name || languageCode,
    code: languageCode,
    missingKeys,
    isValid: missingKeys.length === 0,
    totalKeys: REQUIRED_FOOTER_KEYS.length,
    translatedKeys: REQUIRED_FOOTER_KEYS.length - missingKeys.length,
  };
}




export async function validateLanguageTranslations(
  languageCode: string
): Promise<ValidationResult> {
  try {
    const response = await fetch(`/locales/${languageCode}/common.json`);

    if (!response.ok) {
      throw new Error(
        `Failed to load translations for ${languageCode}: ${response.status}`
      );
    }

    const translations = await response.json();
    return validateTranslationKeys(translations, languageCode);
  } catch (error) {
    console.error(`Error validating translations for ${languageCode}:`, error);

    const language = AVAILABLE_LANGUAGES.find(
      (lang) => lang.code === languageCode
    );
    return {
      language: language?.name || languageCode,
      code: languageCode,
      missingKeys: REQUIRED_FOOTER_KEYS, 
      isValid: false,
      totalKeys: REQUIRED_FOOTER_KEYS.length,
      translatedKeys: 0,
    };
  }
}




export async function validateAllLanguageTranslations(): Promise<
  ValidationResult[]
> {
  const results: ValidationResult[] = [];

  for (const language of AVAILABLE_LANGUAGES) {
    const result = await validateLanguageTranslations(language.code);
    results.push(result);
  }

  return results;
}




export function generateValidationReport(results: ValidationResult[]): string {
  let report = '=== Footer Translation Validation Report ===\n\n';

  const totalLanguages = results.length;
  const validLanguages = results.filter((r) => r.isValid).length;
  const overallSuccess = (validLanguages / totalLanguages) * 100;

  report += `Overall Status: ${validLanguages}/${totalLanguages} languages (${overallSuccess.toFixed(1)}%)\n\n`;

  for (const result of results) {
    const successRate = (result.translatedKeys / result.totalKeys) * 100;
    const status = result.isValid ? '✅ PASS' : '❌ FAIL';

    report += `${result.language} (${result.code}): ${status}\n`;
    report += `  - Translated: ${result.translatedKeys}/${result.totalKeys} (${successRate.toFixed(1)}%)\n`;

    if (result.missingKeys.length > 0) {
      report += `  - Missing keys: ${result.missingKeys.join(', ')}\n`;
    }

    report += '\n';
  }

  return report;
}

export { REQUIRED_FOOTER_KEYS };
