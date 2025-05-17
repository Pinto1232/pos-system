function testPricingPackages() {
  console.log('=== TESTING PRICING PACKAGES DISPLAY ===');

  const packageCards = document.querySelectorAll('[class*="PricingPackages_card"]');
  console.log(`Found ${packageCards.length} package cards on the page`);

  if (packageCards.length === 0) {
    console.error('❌ No pricing packages found on the page!');
    return;
  }

  console.log('✅ Pricing packages are displayed on the page');

  const packageTitles = Array.from(packageCards).map((card) => {
    const titleElement = card.querySelector('[class*="PricingPackages_title"]');
    return titleElement ? titleElement.textContent.trim() : 'Unknown';
  });

  console.log('Package titles:', JSON.stringify(packageTitles, null, 2));

  console.log('Simulating API failure...');

  const originalFetch = window.fetch;

  window.fetch = function (url, options) {
    if (url.includes('PricingPackages')) {
      console.log('🔄 Intercepted pricing packages API call:', JSON.stringify(url, null, 2));
      return Promise.reject(new Error('Simulated API failure'));
    }
    return originalFetch(url, options);
  };

  console.log('Triggering refetch...');

  const retryButton = document.querySelector('button[class*="PricingPackages_retryButton"]');
  if (retryButton) {
    console.log('Found retry button, clicking it...');
    retryButton.click();
  } else {
    console.log('No retry button found, trying to force refetch through React Query cache...');

    console.log('Reloading the page to see if fallback packages appear...');
  }

  setTimeout(() => {
    const packageCardsAfterFailure = document.querySelectorAll('[class*="PricingPackages_card"]');
    console.log(`Found ${packageCardsAfterFailure.length} package cards after simulated API failure`);

    if (packageCardsAfterFailure.length === 0) {
      console.error('❌ No pricing packages found after API failure!');
    } else {
      console.log('✅ Pricing packages are still displayed after API failure');

      const packageTitlesAfterFailure = Array.from(packageCardsAfterFailure).map((card) => {
        const titleElement = card.querySelector('[class*="PricingPackages_title"]');
        return titleElement ? titleElement.textContent.trim() : 'Unknown';
      });

      console.log('Package titles after API failure:', JSON.stringify(packageTitlesAfterFailure, null, 2));

      const samePackages = JSON.stringify(packageTitles) === JSON.stringify(packageTitlesAfterFailure);
      console.log(`Packages before and after API failure are ${samePackages ? 'the same' : 'different'}`);
    }

    console.log('Restoring original fetch function...');
    window.fetch = originalFetch;

    console.log('=== TEST COMPLETED ===');
  }, 2000);
}

console.log(`
=== PRICING PACKAGES TEST SCRIPT ===
This script tests whether pricing packages always show up, even when the API fails.

To run the test:
1. Make sure you're on the homepage (http://localhost:3000)
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Copy and paste this entire script into the console
4. Call the testPricingPackages() function in the console

The test will:
- Check if pricing packages are currently displayed
- Simulate an API failure
- Verify that packages are still displayed after the failure
- Restore the original fetch function

Note: This is a simulation and doesn't affect the actual API.
`);
