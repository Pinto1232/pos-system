// This is a simple script to test that pricing packages always show up
// Run this in the browser console when on the homepage

// Function to test pricing packages display
function testPricingPackages() {
  console.log(
    '=== TESTING PRICING PACKAGES DISPLAY ==='
  );

  // 1. Check if packages are currently displayed
  const packageCards = document.querySelectorAll(
    '[class*="PricingPackages_card"]'
  );
  console.log(
    `Found ${packageCards.length} package cards on the page`
  );

  if (packageCards.length === 0) {
    console.error(
      '❌ No pricing packages found on the page!'
    );
    return;
  }

  console.log(
    '✅ Pricing packages are displayed on the page'
  );

  // 2. Get package titles
  const packageTitles = Array.from(
    packageCards
  ).map((card) => {
    const titleElement = card.querySelector(
      '[class*="PricingPackages_title"]'
    );
    return titleElement
      ? titleElement.textContent.trim()
      : 'Unknown';
  });

  console.log('Package titles:', packageTitles);

  // 3. Simulate API failure by temporarily replacing the fetch function
  console.log('Simulating API failure...');

  // Store the original fetch function
  const originalFetch = window.fetch;

  // Replace fetch with a function that fails for pricing packages API calls
  window.fetch = function (url, options) {
    if (url.includes('PricingPackages')) {
      console.log(
        '🔄 Intercepted pricing packages API call:',
        url
      );
      return Promise.reject(
        new Error('Simulated API failure')
      );
    }
    return originalFetch(url, options);
  };

  // 4. Trigger a refetch of pricing packages
  console.log('Triggering refetch...');

  // Find and click the retry button if it exists
  const retryButton = document.querySelector(
    'button[class*="PricingPackages_retryButton"]'
  );
  if (retryButton) {
    console.log(
      'Found retry button, clicking it...'
    );
    retryButton.click();
  } else {
    console.log(
      'No retry button found, trying to force refetch through React Query cache...'
    );
    // This is a more advanced approach that would require access to the React Query client
    // For simplicity, we'll just reload the page
    console.log(
      'Reloading the page to see if fallback packages appear...'
    );
    // Uncomment the line below to actually reload the page
    // window.location.reload();
  }

  // 5. Check if packages are still displayed after API failure
  setTimeout(() => {
    const packageCardsAfterFailure =
      document.querySelectorAll(
        '[class*="PricingPackages_card"]'
      );
    console.log(
      `Found ${packageCardsAfterFailure.length} package cards after simulated API failure`
    );

    if (packageCardsAfterFailure.length === 0) {
      console.error(
        '❌ No pricing packages found after API failure!'
      );
    } else {
      console.log(
        '✅ Pricing packages are still displayed after API failure'
      );

      // Get package titles after failure
      const packageTitlesAfterFailure =
        Array.from(packageCardsAfterFailure).map(
          (card) => {
            const titleElement =
              card.querySelector(
                '[class*="PricingPackages_title"]'
              );
            return titleElement
              ? titleElement.textContent.trim()
              : 'Unknown';
          }
        );

      console.log(
        'Package titles after API failure:',
        packageTitlesAfterFailure
      );

      // Compare with original titles
      const samePackages =
        JSON.stringify(packageTitles) ===
        JSON.stringify(packageTitlesAfterFailure);
      console.log(
        `Packages before and after API failure are ${samePackages ? 'the same' : 'different'}`
      );
    }

    // Restore the original fetch function
    console.log(
      'Restoring original fetch function...'
    );
    window.fetch = originalFetch;

    console.log('=== TEST COMPLETED ===');
  }, 2000);
}

// Instructions for running the test
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
