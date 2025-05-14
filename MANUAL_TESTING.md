# Manual Testing Guide

This guide provides step-by-step instructions for manually testing two key
features:

1. The spinner when navigating from payment success to dashboard
2. The pricing packages always showing up, even when the API fails

## 1. Testing the Spinner When Navigating to Dashboard

### Prerequisites

- The application is running locally (`npm run dev`)
- You have access to the payment success page

### Test Steps

1. **Access the Payment Success Page**

   - Navigate to: `http://localhost:3000/checkout/success`
   - Verify that the payment success modal is displayed with the message
     "Payment Successful! 🎉"
   - Verify that the "Return to Dashboard" button is visible

2. **Test the Spinner Behavior**

   - Click the "Return to Dashboard" button
   - Verify that a loading spinner appears immediately after clicking
   - Verify that you are redirected to the dashboard page
   - Verify that the spinner remains visible for approximately 3 seconds on the
     dashboard page
   - Verify that after 3 seconds, the spinner disappears and the dashboard
     content is displayed

3. **Test Edge Cases**
   - Refresh the page during the spinner display
   - Verify that the spinner disappears after 3 seconds
   - Navigate back to the success page and repeat the test to ensure consistency

### Expected Results

- The spinner should appear immediately after clicking "Return to Dashboard"
- The spinner should remain visible for about 3 seconds on the dashboard page
- The dashboard content should appear after the spinner disappears
- The experience should be smooth and consistent

## 2. Testing That Pricing Packages Always Show Up

### Prerequisites

- The application is running locally (`npm run dev`)
- You have access to the homepage

### Test Steps

#### Method 1: Using the Browser Console

1. **Access the Homepage**

   - Navigate to: `http://localhost:3000`
   - Verify that pricing packages are displayed

2. **Run the Test Script**
   - Open the browser's developer console (F12 or right-click > Inspect >
     Console)
   - Copy and paste the content of `src/test-pricing-packages.js` into the
     console
   - Run the test by typing: `testPricingPackages()`
   - Observe the console output to verify that:
     - Pricing packages are initially displayed
     - After simulating an API failure, pricing packages are still displayed
     - The fallback packages are used when the API fails

#### Method 2: Manually Testing API Failure

1. **Access the Homepage**

   - Navigate to: `http://localhost:3000`
   - Verify that pricing packages are displayed

2. **Simulate Network Failure**

   - In the browser's developer tools, go to the Network tab
   - Click on "Offline" to simulate network disconnection
   - Refresh the page
   - Verify that pricing packages are still displayed despite being offline

3. **Test with Invalid API Response**
   - Reconnect to the network
   - In the browser's developer tools, go to the Network tab
   - Find any API requests related to pricing packages
   - Right-click on the request and select "Block request URL" or similar option
   - Refresh the page
   - Verify that pricing packages are still displayed despite the API being
     blocked

### Expected Results

- Pricing packages should always be visible on the homepage
- When the API fails, fallback packages should be displayed
- The user should not see any error messages or empty states related to pricing
  packages
- The pricing packages should display with correct formatting and styling

## 3. Testing Both Features Together

1. **Complete a Purchase Flow**

   - Add a product to your cart
   - Proceed to checkout
   - Complete the payment process
   - Verify you are redirected to the payment success page

2. **Test the Return to Dashboard Flow**

   - On the payment success page, click "Return to Dashboard"
   - Verify the spinner appears
   - Verify you are redirected to the dashboard
   - Verify the spinner disappears after 3 seconds

3. **Test Pricing Packages After Authentication**
   - Navigate back to the homepage
   - Verify pricing packages are displayed
   - Simulate API failure as described above
   - Verify pricing packages still display correctly

## Reporting Issues

If you encounter any issues during testing, please document:

1. The specific test case that failed
2. The expected behavior
3. The actual behavior
4. Any error messages in the console
5. Screenshots if applicable

## Test Completion Checklist

- [ ] Spinner appears when clicking "Return to Dashboard"
- [ ] Spinner remains visible for ~3 seconds on dashboard
- [ ] Dashboard content appears after spinner disappears
- [ ] Pricing packages display on initial page load
- [ ] Pricing packages display when API fails
- [ ] Pricing packages display when offline
- [ ] All packages show correct formatting and styling
- [ ] No error messages are visible to the user
