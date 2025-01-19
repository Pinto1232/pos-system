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

export const navigateBasedOnRule = (currentStep: string, action: string, id?: number): string => {
  // Ensure `id` is provided when required
  if (!id && ["Custom", "Customize", "Starter", "Growth", "Enterprise", "Premium"].includes(action)) {
    console.error("Error: ID is required for this action.");
    return "/subscription/package-selection"; // Fallback route
  }

  switch (currentStep) {
    case "1-PackageSelection":
      // Redirect based on package selection
      if (action === "Starter") {
        console.log(`Redirecting to /subscription/starter-package/${id}`);
        return `/subscription/starter-package/${id}`;
      }
      if (action === "Custom") {
        console.log(`Redirecting to /subscription/custom-package/${id}`);
        return `/subscription/custom-package/${id}`;
      }
      if (action === "Growth") {
        console.log(`Redirecting to /subscription/growth/${id}`);
        return `/subscription/growth/${id}`;
      }
      if (action === "Enterprise") {
        console.log(`Redirecting to /subscription/enterprise/${id}`);
        return `/subscription/enterprise/${id}`;
      }
      if (action === "Premium") {
        console.log(`Redirecting to /subscription/premium/${id}`);
        return `/subscription/premium/${id}`;
      }
      break;

    case "2-CustomPackage":
      // Handle customization from custom package
      if (action === "Customize") {
        console.log(`Redirecting to /subscription/customization/${id}`);
        return `/subscription/customization/${id}`;
      }
      break;

    case "1.0-StarterPackage":
      // Handle transition from Starter Package to Detail Revision
      if (action === "Review") {
        console.log(`Redirecting to /subscription/detail-revision/${id}`);
        return `/subscription/detail-revision/${id}`;
      }
      break;

    case "2.0-Customization":
      // Handle transition from Customization to Detail Revision
      if (action === "Review") {
        console.log(`Redirecting to /subscription/detail-revision/${id}`);
        return `/subscription/detail-revision/${id}`;
      }
      break;

    case "3-DetailRevision":
      // Handle transition from Detail Revision to Product Detail
      if (action === "Confirm") {
        console.log(`Redirecting to /subscription/product-detail/${id}`);
        return `/subscription/product-detail/${id}`;
      }
      // Handle backtracking to Package Selection
      if (action === "Back") {
        console.log("Redirecting to /subscription/package-selection");
        return "/subscription/package-selection";
      }
      break;

    case "4-ProductDetail":
      // Handle transition from Product Detail to Completion
      if (action === "Finalize") {
        console.log("Redirecting to /subscription/completion");
        return "/subscription/completion";
      }
      break;

    default:
      // Fallback for unexpected cases
      console.warn("Invalid step or action. Redirecting to /subscription/package-selection.");
      return "/subscription/package-selection";
  }

  // Final fallback
  console.warn("Unexpected case: Returning root fallback /");
  return "/";
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
