export const STRIPE_PRICE_IDS: Record<
  | 'custom-pro'
  | 'starter-plus'
  | 'growth-pro'
  | 'enterprise-elite'
  | 'premium-plus',
  string
> = {
  'starter-plus': 'price_starter_plus_monthly',
  'growth-pro': 'price_growth_pro_monthly',
  'custom-pro': 'price_custom_pro_monthly',
  'enterprise-elite': 'price_enterprise_elite_monthly',
  'premium-plus': 'price_premium_plus_monthly',
};

export const STRIPE_MULTI_CURRENCY_PRICE_IDS: Record<
  string,
  Record<string, string>
> = {
  'starter-plus': {
    USD: 'price_starter_plus_usd_monthly',
    EUR: 'price_starter_plus_eur_monthly',
    GBP: 'price_starter_plus_gbp_monthly',
    ZAR: 'price_starter_plus_zar_monthly',
  },
  'growth-pro': {
    USD: 'price_growth_pro_usd_monthly',
    EUR: 'price_growth_pro_eur_monthly',
    GBP: 'price_growth_pro_gbp_monthly',
    ZAR: 'price_growth_pro_zar_monthly',
  },
  'custom-pro': {
    USD: 'price_custom_pro_usd_monthly',
    EUR: 'price_custom_pro_eur_monthly',
    GBP: 'price_custom_pro_gbp_monthly',
    ZAR: 'price_custom_pro_zar_monthly',
  },
  'enterprise-elite': {
    USD: 'price_enterprise_elite_usd_monthly',
    EUR: 'price_enterprise_elite_eur_monthly',
    GBP: 'price_enterprise_elite_gbp_monthly',
    ZAR: 'price_enterprise_elite_zar_monthly',
  },
  'premium-plus': {
    USD: 'price_premium_plus_usd_monthly',
    EUR: 'price_premium_plus_eur_monthly',
    GBP: 'price_premium_plus_gbp_monthly',
    ZAR: 'price_premium_plus_zar_monthly',
  },
};

export const STRIPE_PRODUCT_IDS: Record<string, string> = {
  'starter-plus': 'prod_starter_plus',
  'growth-pro': 'prod_growth_pro',
  'custom-pro': 'prod_custom_pro',
  'enterprise-elite': 'prod_enterprise_elite',
  'premium-plus': 'prod_premium_plus',
};

export function getStripePriceId(
  packageType: string,
  currency: string = 'USD'
): string {
  const multiCurrencyPrices = STRIPE_MULTI_CURRENCY_PRICE_IDS[packageType];
  if (multiCurrencyPrices && multiCurrencyPrices[currency]) {
    return multiCurrencyPrices[currency];
  }

  return STRIPE_PRICE_IDS[packageType as keyof typeof STRIPE_PRICE_IDS] || '';
}
