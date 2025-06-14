import React from 'react';
import FeatureGuard from './common/FeatureGuard';
import { SidebarFeatureGuard } from './SidebarFeatureGuard';
import { SidebarItem as SidebarItemType } from '../Seetings/settings';

interface SidebarWrapperProps {
  items: SidebarItemType[];
  renderItem: (item: SidebarItemType, isSubItem?: boolean) => React.ReactNode;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  items,
  renderItem,
}) => {
  const renderSidebarItem = (
    item: SidebarItemType,
    isSubItem: boolean = false
  ) => {
    const subItems = item.subItems?.map((subItem) => (
      <FeatureGuard
        key={`${item.label}-${subItem.label}`}
        featureName={subItem.label}
        mode="overlay"
        size="small"
        tooltipPlacement="right"
      >
        {renderItem(
          { ...subItem, icon: item.icon, expandable: false } as SidebarItemType,
          true
        )}
      </FeatureGuard>
    ));

    const content = renderItem(item, isSubItem);

    if (item.requiredPackage) {
      return (
        <SidebarFeatureGuard featureName={item.label} key={item.label}>
          {content}
          {subItems}
        </SidebarFeatureGuard>
      );
    }

    return (
      <React.Fragment key={item.label}>
        {content}
        {subItems}
      </React.Fragment>
    );
  };

  return <>{items.map((item) => renderSidebarItem(item))}</>;
};
