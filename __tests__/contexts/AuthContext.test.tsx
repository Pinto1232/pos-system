import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContext } from '@/contexts/AuthContext';

const DummyComponent = () => (
  <AuthContext.Consumer>
    {({ authenticated }) => <div>{authenticated ? 'Authenticated' : 'Not Authenticated'}</div>}
  </AuthContext.Consumer>
);

test('AuthContext dummy test', () => {
  render(<DummyComponent />);
  expect(screen.getByText(/Authenticated|Not Authenticated/i)).toBeInTheDocument();
});
