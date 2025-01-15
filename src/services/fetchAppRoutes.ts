import { Route, appRoutes } from '@/routes/appRoutes';

export const fetchAppRoutes = async (userRole: string): Promise<Route[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Example: Filter routes based on user role
      const filteredRoutes = appRoutes.filter((route) => {
        // Implement your role-based filtering logic here
        // For instance, only admins can access the 'Admin Panel' route
        if (route.label === 'Admin Panel' && userRole !== 'admin') {
          return false;
        }
        return true;
      });

      resolve(filteredRoutes);
    }, 1000);
  });
};

export default fetchAppRoutes;
