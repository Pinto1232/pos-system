import React from 'react';
import { List } from '@mui/material';
import { SidebarItemType } from './types';
import SidebarItem from './SidebarItem';

interface SidebarRendererProps {
  items: SidebarItemType[];
  activeItem: string;
  expandedItems: { [key: string]: boolean };
  iconColor: string;
  textColor: string;
  isCollapsed: boolean;
  onToggle: (label: string) => void;
  onItemClick: (label: string) => void;
  onSettingsClick?: () => void;
}

const SidebarRenderer: React.FC<SidebarRendererProps> = ({
  items,
  activeItem,
  expandedItems,
  iconColor,
  textColor,
  isCollapsed,
  onToggle,
  onItemClick,
  onSettingsClick,
}) => {
  return (
    <List>
      {items.map((item) => (
        <SidebarItem
          key={item.label}
          item={item}
          isActive={activeItem === item.label}
          isExpanded={!!expandedItems[item.label]}
          iconColor={iconColor}
          textColor={textColor}
          onToggle={onToggle}
          onItemClick={onItemClick}
          onSettingsClick={onSettingsClick}
          isCollapsed={isCollapsed}
        />
      ))}
    </List>
  );
};

export default SidebarRenderer;
