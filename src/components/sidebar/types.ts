import { ElementType } from 'react';

export interface SubItem {
  label: string;
  translationKey?: string;
  path?: string;
}

export interface SidebarItemType {
  label: string;
  translationKey?: string;
  icon: ElementType;
  path?: string;
  expandable?: boolean;
  subItems?: SubItem[];
}

export interface MenuToggleButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export interface SidebarItemProps {
  item: SidebarItemType;
  isActive: boolean;
  isExpanded: boolean;
  iconColor: string;
  textColor: string;
  onToggle: (label: string) => void;
  onItemClick: (label: string) => void;
  onSettingsClick?: () => void;
  isCollapsed?: boolean;
}

export interface SubItemsProps {
  parentLabel: string;
  subItems: SubItem[];
  isExpanded: boolean;
  activeItem: string;
  textColor: string;
  onItemClick: (label: string, parentLabel: string) => void;
}

export interface SidebarProps {
  drawerWidth: number;
  isDrawerOpen: boolean;
  onSectionSelect: (section: string) => void;
  onSettingsClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  logoUrl?: string;
  handleItemClick: (section: string) => void;
  onDrawerToggle?: () => void;
}
