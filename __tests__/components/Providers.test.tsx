import React from 'react';
import { render } from '@testing-library/react';
import Providers from '@/components/Providers';

test('Providers dummy test', () => {
  const { container } = render(<Providers><div>Test</div></Providers>);
  expect(container).toBeDefined();
});
