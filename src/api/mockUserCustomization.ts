import { UserCustomization } from '@/components/dashboard-layout/DashboardLayout';

const STORAGE_KEY = 'userCustomization';

export const mockFetchCustomization = async (userId: string): Promise<UserCustomization> => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }

  // Return default values if no customization exists
  return {
    id: 1,
    userId,
    sidebarColor: '#173A79',
    logoUrl: '/Pisval_Logo.jpg',
    navbarColor: '#000000'
  };
};

export const mockUpdateCustomization = async (customization: UserCustomization): Promise<UserCustomization> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
  return customization;
}; 