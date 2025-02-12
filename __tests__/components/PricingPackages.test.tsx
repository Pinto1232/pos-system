import { render, screen } from '@testing-library/react';
import PricingPackages from '@/components/PricingPackages';

test('PricingPackages should render', () => {
  render(<PricingPackages />);
  expect(screen.getByText(/Pricing Packages/i)).toBeInTheDocument();
});
