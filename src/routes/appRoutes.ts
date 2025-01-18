import React from 'react';
import {
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  ShoppingCart as ProductIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

// Centralized Rule-Based Navigation Logic
export const navigateBasedOnRule = (currentStep: string, action: string, id?: number): string => {
  switch (currentStep) {
    case '1-PackageSelection':
      if (action === 'Starter') {
        return `/app/subscription/detail-revision/${id}`;
      } else if (action === 'Custom') {
        return `/app/subscription/customization/${id}`;
      }
      break;

    case '2-CustomPackage':
      if (action === 'Customize') {
        return `/app/subscription/customization/${id}`;
      } else if (action === 'Cancel') {
        return '/app/subscription/custom-package';
      }
      break;

    case '1.0-StarterPackage':
    case '2.0-Customization':
      if (action === 'ReviewDetails') {
        return `/app/subscription/detail-revision/${id}`;
      }
      break;

    case '3-DetailRevision':
      if (action === 'Confirm') {
        return `/app/subscription/product-detail/${id}`;
      } else if (action === 'ChangePackage') {
        return '/app/subscription/package-selection';
      }
      break;

    case '4-ProductDetail':
      if (action === 'Finalize') {
        return '/app/subscription/completion';
      }
      break;

    default:
      return '/app/subscription/package-selection';
  }

  // Fallback to a default path
  return '/';
};

// Route interface definition
export interface Route {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: Route[];
  rules?: (action: string, currentStep: string, id?: number) => string | undefined;
}

// Routes configuration
export const appRoutes: Route[] = [
  {
    label: 'Home',
    icon: HomeIcon,
    path: '/',
  },
  {
    label: 'Products',
    icon: ProductIcon,
    path: '/products',
    children: [
      {
        label: 'Product Details',
        icon: ProductIcon,
        path: '/products/[id]',
      },
    ],
  },
  {
    label: 'Calendar',
    icon: CalendarIcon,
    path: '/calendar',
  },
  {
    label: 'Files',
    icon: FolderIcon,
    children: [
      {
        label: 'Images',
        icon: ImageIcon,
        path: '/files/images',
      },
      {
        label: 'Audio',
        icon: AudioIcon,
        path: '/files/audio',
      },
    ],
  },
  {
    label: 'Team',
    icon: PeopleIcon,
    path: '/team',
  },
  {
    label: 'Campaigns',
    icon: CampaignIcon,
    path: '/campaigns',
  },
];

export default appRoutes;
