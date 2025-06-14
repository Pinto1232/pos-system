# Dynamic Pricing System Guide

This guide explains how to migrate from hardcoded pricing to dynamic pricing
fetched from the backend with automatic currency conversion.

## 🚀 Quick Start

### Before (Hardcoded Pricing)

```typescript
// Old settings.ts
requiredPackage: {
  minPrice: 149.99,  // ❌ Hardcoded
  name: 'Premium Plus',
}
```

### After (Dynamic Pricing)

```typescript
// New dynamicSettings.ts
requiredPackage: {
  packageName: 'Premium Plus',  // ✅ Dynamic
}
```

## 📋 Migration Steps

### 1. Install the New System

```bash
# The new files are already created:
# - /api/pricingService.ts
# - /Seetings/dynamicSettings.ts
# - /hooks/useDynamicPricing.ts
# - /components/DynamicSidebar.tsx
# - /utils/pricingMigration.ts
```

### 2. Update Your Components

#### Option A: Use the New Dynamic Sidebar Component

```typescript
import DynamicSidebar from '@/components/DynamicSidebar';

function MyApp() {
  return (
    <DynamicSidebar
      className="w-64"
      onItemClick={(item) => console.log('Clicked:', item)}
    />
  );
}
```

#### Option B: Use the Hook for Custom Implementation

```typescript
import { useSidebarPricing } from '@/hooks/useDynamicPricing';

function MyCustomSidebar() {
  const { getMinPrice, getCurrency, loading } = useSidebarPricing();

  if (loading) return <div>Loading pricing...</div>;

  const basicPrice = getMinPrice('Basic');
  const currency = getCurrency('Basic');

  return (
    <div>
      Basic Package: {currency} {basicPrice}
    </div>
  );
}
```

#### Option C: Use Legacy Format (Backward Compatibility)

```typescript
import { getSidebarItems } from '@/Seetings/dynamicSettings';

function MyLegacySidebar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getSidebarItems().then(setItems);
  }, []);

  return (
    <div>
      {items.map(item => (
        <div key={item.label}>
          {item.label}: ${item.requiredPackage?.minPrice}
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### Backend Setup

Ensure your backend has the following packages configured:

```sql
-- Required packages in database
INSERT INTO PricingPackages (Title, Price, Currency, Type, TierLevel) VALUES
('Basic', 29.99, 'USD', 'standard', 1),
('Professional', 49.99, 'USD', 'standard', 2),
('Enterprise', 99.99, 'USD', 'standard', 3),
('Premium Plus', 149.99, 'USD', 'standard', 4);
```

### Currency Configuration

The system automatically detects user location and converts prices:

```typescript
// Backend controller handles currency conversion
// Frontend automatically receives converted prices
```

## 🎯 Features

### ✅ What's Improved

1. **No More Hardcoded Prices**: All prices come from the database
2. **Automatic Currency Conversion**: Prices shown in user's local currency
3. **Centralized Management**: Update prices in one place (backend)
4. **Caching**: Efficient caching prevents excessive API calls
5. **Fallback System**: Graceful degradation if backend is unavailable
6. **Type Safety**: Full TypeScript support

### 🔄 Migration Features

1. **Backward Compatibility**: Old components still work
2. **Gradual Migration**: Migrate components one by one
3. **Validation Tools**: Check for missing packages
4. **Performance Testing**: Monitor performance impact

## 🧪 Testing & Validation

### Validate Package Existence

```typescript
import { validatePackageExistence } from '@/utils/pricingMigration'

async function checkPackages() {
  const result = await validatePackageExistence()
  console.log('Missing packages:', result.missingPackages)
  console.log('Available packages:', result.availablePackages)
}
```

### Compare Old vs New Pricing

```typescript
import { comparePricing } from '@/utils/pricingMigration'
import { sidebarItems as oldItems } from '@/Seetings/settings'

async function compareChanges() {
  const result = await comparePricing(oldItems)
  console.log('Price changes:', result.changes)
}
```

### Performance Testing

```typescript
import { performanceTest } from '@/utils/pricingMigration'

async function testPerformance() {
  const result = await performanceTest()
  console.log('Load time:', result.dynamicPricingTime)
  console.log('Cache time:', result.cacheHitTime)
  console.log('Recommendations:', result.recommendations)
}
```

## 🚨 Common Issues & Solutions

### Issue: Packages Not Found

```typescript
// Problem: Backend doesn't have required packages
// Solution: Use the SQL generator
import { generatePackageSeedSQL } from '@/utils/pricingMigration'

const sql = generatePackageSeedSQL(['Basic', 'Professional'])
console.log(sql) // Execute in your database
```

### Issue: Slow Loading

```typescript
// Problem: Prices load slowly
// Solution: Preload pricing data
import { pricingService } from '@/api/pricingService'

// In your app initialization
pricingService.getAllPackages() // Preload
```

### Issue: Currency Not Converting

```typescript
// Problem: Prices always show in USD
// Solution: Check backend geo-location service
// Ensure GeoLite2-Country.mmdb file exists
```

## 📊 Monitoring

### Cache Performance

```typescript
// Monitor cache hit rates
const { refreshPricing } = useDynamicPricing()

// Force refresh for testing
await refreshPricing()
```

### Error Handling

```typescript
const { error } = useDynamicPricing()

if (error) {
  console.error('Pricing error:', error)
  // Show fallback UI or cached data
}
```

## 🔄 Rollback Plan

If you need to rollback to hardcoded pricing:

1. **Immediate**: Use the old `settings.ts` file
2. **Gradual**: Set fallback values in `dynamicSettings.ts`
3. **Emergency**: Disable dynamic pricing in environment variables

```typescript
// Emergency fallback
const USE_DYNAMIC_PRICING =
  process.env.NEXT_PUBLIC_USE_DYNAMIC_PRICING === 'true'

if (!USE_DYNAMIC_PRICING) {
  // Use old hardcoded values
  return oldSidebarItems
}
```

## 📈 Performance Metrics

### Expected Performance

- **First Load**: ~200-500ms (with API call)
- **Cached Load**: ~5-10ms (from memory)
- **Cache Duration**: 5 minutes (configurable)

### Optimization Tips

1. Preload pricing data on app start
2. Use React Suspense for loading states
3. Implement service worker caching
4. Monitor bundle size impact

## 🔐 Security Considerations

1. **API Protection**: Pricing API should have rate limiting
2. **Input Validation**: Validate package names on backend
3. **Cache Invalidation**: Secure cache clearing mechanisms
4. **Error Handling**: Don't expose sensitive error details

## 📝 Next Steps

1. **Phase 1**: Deploy new system alongside old one
2. **Phase 2**: Migrate components gradually
3. **Phase 3**: Remove old hardcoded system
4. **Phase 4**: Add advanced features (A/B testing, personalized pricing)

## 🤝 Contributing

When adding new features that require pricing:

1. Use dynamic pricing from the start
2. Add package validation tests
3. Update this documentation
4. Consider multi-currency support

## 📞 Support

For questions or issues:

1. Check the migration utilities first
2. Validate backend configuration
3. Test with different currencies
4. Monitor performance metrics

---

**Remember**: This system provides flexibility and maintainability at the cost
of some complexity. The benefits include centralized pricing management,
automatic currency conversion, and easier maintenance.
