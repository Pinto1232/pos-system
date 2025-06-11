export interface MegaMenuItem {
  id: string;
  title: string;
  translationKey?: string;
  link?: string;
  icon?: React.ReactNode;
  columns?: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
}

export interface MegaMenuColumn {
  id: string;
  title: string;
  items: MegaMenuSubItem[];
}

export interface MegaMenuSubItem {
  id: string;
  title: string;
  link: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
}

export interface MegaMenuProps {
  items: MegaMenuItem[];
  onItemClick?: (item: MegaMenuItem) => void;
}
