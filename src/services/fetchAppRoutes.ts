import { Route, appRoutes, navigateBasedOnRule } from '@/routes/appRoutes';

export const fetchAppRoutes = async (userRole: string): Promise<Route[]> => {
  // Simulate a network call if needed
  const filteredRoutes = appRoutes.filter((route) => {
    // Role-based filtering logic
    if (route.label === 'Admin Panel' && userRole !== 'admin') {
      return false;
    }
    return true;
  });

  return filteredRoutes;
};

export const getNextRoute = (currentStep: string, action: string, id?: number): string => {
  return navigateBasedOnRule(currentStep, action, id); // Centralized logic for navigation
};

export default fetchAppRoutes;
