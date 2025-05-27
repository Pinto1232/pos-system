const React = require('react');

function testFunction() {
  // eslint-disable-next-line no-console
  console.log('This ESLint directive should be preserved');

  const value = 42;

  /* eslint-disable no-unused-vars */
  const unusedVariable = 'test';
  console.log('Variable for testing:', unusedVariable); // Use the variable
  /* eslint-enable no-unused-vars */

  return value;
}

// Test component that uses React hooks properly
function TestComponent() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useCallback = React.useCallback(() => {
    return 'test';
  }, []);

  return useCallback();
}

function anotherFunction() {
  // eslint-disable no-magic-numbers
  const numbers = [1, 2, 3, 4, 5];
  // eslint-enable no-magic-numbers

  return numbers;
}

module.exports = { testFunction, TestComponent, anotherFunction };
