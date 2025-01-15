import React from 'react';
import {
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Movie as VideoIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  ShoppingCart as ProductIcon,
} from '@mui/icons-material';

export interface Route {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: Route[];
}

export const appRoutes: Route[] = [
  {
    label: 'Products',
    icon: ProductIcon,
    path: '/products',
  },
  {
    label: 'Product Details',
    icon: ProductIcon,
    path: '/products/[id]', // Dynamic route for product details
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
      { label: 'Images', icon: ImageIcon, path: '/files/images' },
      { label: 'Audio', icon: AudioIcon, path: '/files/audio' },
      { label: 'Videos', icon: VideoIcon, path: '/files/videos' },
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

  // Additional routes as needed
];

export default appRoutes;
