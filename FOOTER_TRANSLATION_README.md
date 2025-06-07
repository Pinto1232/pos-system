# Footer Translation System Documentation

## Overview

The footer translation system ensures that all footer content is properly
translated across all supported languages. This document provides a
comprehensive guide to understanding, testing, and maintaining the footer
translations.

## Supported Languages

- **English (en)** - Default language
- **Portuguese (pt)** - Angola
- **Spanish (es)** - Spain
- **French (fr)** - France

## Footer Translation Keys

### Subscription Section

- `subscription.title` - "SUBSCRIBE NOW"
- `subscription.subtitle` - "FOR UPDATES AND EXCLUSIVE OFFERS!"
- `subscription.placeholder` - Email input placeholder
- `subscription.button` - Subscribe button text

### Footer Navigation

- `footer.company` - Company section title
- `footer.home` - Home link
- `footer.services` - Services link
- `footer.about` - About Us link
- `footer.contact` - Contact link

### Contact Information

- `footer.tel1` - First phone number
- `footer.tel2` - Second phone number
- `footer.email1` - Info email
- `footer.email2` - Career email

### Office Information

- `footer.office` - Office location title
- `footer.address1` - Address line 1
- `footer.address2` - Address line 2
- `footer.address3` - Address line 3

### Social & Legal

- `footer.followUs` - Social media section title
- `footer.privacy` - Privacy Policy link
- `footer.copyright` - Copyright notice (with year interpolation)

## Translation Files Location

```
frontend/public/locales/
├── en/common.json
├── pt/common.json
├── es/common.json
└── fr/common.json
```

## Key Features

### 1. Dynamic Year in Copyright

The copyright notice automatically updates with the current year using
interpolation:

```typescript
<TranslatedText
  i18nKey="footer.copyright"
  values={{ year: new Date().getFullYear() }}
  defaultValue={`© ${new Date().getFullYear()} Pisval Tech. All rights reserved.`}
/>
```

Translation files use:
`"copyright": "© {{year}} Pisval Tech. All rights reserved."`

### 2. Fallback System

Each `TranslatedText` component includes a `defaultValue` to ensure content is
always displayed, even if translations are missing.

### 3. Responsive Design

Footer translations work seamlessly across all device sizes with responsive
typography and layout.

## Testing the Footer Translations

### 1. Automated Testing

Use the validation utility:

```typescript
import { validateAllLanguageTranslations } from '@/utils/validateFooterTranslations'

const results = await validateAllLanguageTranslations()
console.log(results)
```

### 2. Visual Testing

Visit the test page: `/test-footer-translations`

This page provides:

- Live translation testing dashboard
- Language switching functionality
- Visual validation of all footer elements
- Success rate reporting

### 3. Manual Testing

1. Navigate to any page with the footer
2. Use the language selector in the navbar
3. Verify all footer text changes to the selected language
4. Check that the copyright year is current
5. Ensure no text shows translation keys (e.g., "footer.company")

## Common Issues and Solutions

### Issue 1: Translation Key Showing Instead of Text

**Symptoms:** Text displays as "footer.company" instead of "Company" **Causes:**

- Missing translation key in language file
- Incorrect key name in component
- Translation file not loaded properly

**Solutions:**

1. Check if the key exists in `/public/locales/{lang}/common.json`
2. Verify the key name matches exactly (case-sensitive)
3. Clear browser cache and reload

### Issue 2: Copyright Year Not Updating

**Symptoms:** Copyright shows "{{year}}" or wrong year **Causes:**

- Missing `values` prop in TranslatedText component
- Incorrect interpolation syntax in translation file

**Solutions:**

1. Ensure component includes: `values={{ year: new Date().getFullYear() }}`
2. Check translation file uses: `"copyright": "© {{year}} Pisval Tech..."`

### Issue 3: Language Not Switching

**Symptoms:** Footer remains in same language when switching **Causes:**

- Translation files not loaded
- Component not re-rendering
- Browser caching issues

**Solutions:**

1. Check browser network tab for translation file requests
2. Verify TranslationProvider wraps the component
3. Clear localStorage and cookies

## Adding New Languages

1. **Create translation file:**

   ```bash
   cp public/locales/en/common.json public/locales/{new-lang}/common.json
   ```

2. **Translate all footer keys:**

   - Maintain the same JSON structure
   - Translate only the values, not the keys
   - Keep interpolation syntax: `{{year}}`

3. **Add language to configuration:**

   ```typescript
   // In src/i18n/i18n.ts
   export const AVAILABLE_LANGUAGES = [
     // ... existing languages
     {
       code: 'new-lang',
       name: 'Language Name',
       flag: 'country-code',
       region: 'Region Name',
     },
   ]
   ```

4. **Add flag icon:**

   - Add flag SVG to `public/flags/{country-code}.svg`

5. **Test the new language:**
   - Use the test page `/test-footer-translations`
   - Verify all footer elements translate correctly

## Maintenance Checklist

### Monthly

- [ ] Run translation validation tests
- [ ] Check copyright year is current
- [ ] Verify all languages load correctly

### When Adding New Footer Content

- [ ] Add translation keys to all language files
- [ ] Update `REQUIRED_FOOTER_KEYS` in validation utility
- [ ] Test with all supported languages
- [ ] Update this documentation

### When Updating Translations

- [ ] Maintain consistent terminology across languages
- [ ] Preserve interpolation syntax
- [ ] Test on multiple devices/browsers
- [ ] Verify accessibility compliance

## Performance Considerations

1. **Lazy Loading:** Footer uses React.Suspense for optimal loading
2. **Caching:** Translation files are cached by the browser
3. **Bundle Size:** Only active language translations are loaded
4. **Memory:** Previous language translations are kept in memory for fast
   switching

## Accessibility

- All footer links have proper ARIA labels
- Text contrast meets WCAG guidelines
- Keyboard navigation is fully supported
- Screen readers can properly announce translated content

## Troubleshooting Commands

```bash
# Check translation file syntax
npx jsonlint public/locales/en/common.json

# Validate all translation files
npm run validate-translations

# Test footer translations
npm run test:footer-translations

# Clear translation cache
localStorage.removeItem('language');
document.cookie = 'i18next=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
```

## Support

For issues with footer translations:

1. Check this documentation first
2. Run the automated tests
3. Use the visual test page
4. Check browser console for errors
5. Verify translation file syntax

Remember: The footer translation system is designed to be robust and
user-friendly. When in doubt, the system will fall back to default English text
to ensure the user experience is never broken.
