import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface TestPeriodContextProps {
  testPeriod: number;
  setTestPeriod: (testPeriod: number) => void;
}

const TestPeriodContext = createContext<
  TestPeriodContextProps | undefined
>(undefined);

export const TestPeriodProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [testPeriod, setTestPeriod] = useState(0);

  return (
    <TestPeriodContext.Provider
      value={{ testPeriod, setTestPeriod }}
    >
      {children}
    </TestPeriodContext.Provider>
  );
};

export const useTestPeriod = () => {
  const context = useContext(TestPeriodContext);
  if (!context) {
    throw new Error(
      'useTestPeriod must be used within a TestPeriodProvider'
    );
  }
  return context;
};
