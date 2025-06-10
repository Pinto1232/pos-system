import { useMemo } from 'react';
import { useTierAccess } from './useTierAccess';
import { SidebarItem } from '@/Seetings/settings';

export const useSidebarAccess = () => {
  const { hasPackageAccess, getCurrentPackageInfo, currentTierLevel } =
    useTierAccess();

  const filterSidebarItems = useMemo(() => {
    return (items: SidebarItem[]): SidebarItem[] => {
      return items.map((item) => {
        const hasMainAccess =
          !item.requiredPackage ||
          hasPackageAccess(
            item.requiredPackage.minPrice,
            item.requiredPackage.name
          );

        const filteredSubItems = item.subItems?.filter((subItem) => {
          if (!subItem.requiredPackage) return true;
          return hasPackageAccess(
            subItem.requiredPackage.minPrice,
            subItem.requiredPackage.name
          );
        });

        return {
          ...item,
          hasAccess: hasMainAccess,
          subItems: filteredSubItems,

          isLocked: !hasMainAccess,
          requiredUpgrade: !hasMainAccess ? item.requiredPackage : undefined,
        };
      });
    };
  }, [hasPackageAccess]);

  const checkItemAccess = (requiredPackage?: {
    minPrice: number;
    name: string;
    excludeFromPremiumPlus?: boolean;
  }) => {
    if (!requiredPackage) return true;
    return hasPackageAccess(requiredPackage.minPrice, requiredPackage.name);
  };

  return {
    filterSidebarItems,
    checkItemAccess,
    getCurrentPackageInfo,
    currentTierLevel,
  };
};

export default useSidebarAccess;
