import React, { useState, useEffect } from 'react';
import { useSidebarPricing } from '@/hooks/useDynamicPricing';
import { getSidebarItems, LegacySidebarItem } from '@/Seetings/dynamicSettings';

interface DynamicSidebarProps {
  className?: string;
  onItemClick?: (item: LegacySidebarItem) => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  className = '',
  onItemClick,
}) => {
  const [sidebarItems, setSidebarItems] = useState<LegacySidebarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loading: pricingLoading, error: pricingError } = useSidebarPricing();

  useEffect(() => {
    const loadSidebarItems = async () => {
      try {
        setIsLoading(true);
        const items = await getSidebarItems();
        setSidebarItems(items);
      } catch (error) {
        console.error('Failed to load sidebar items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSidebarItems();
  }, []);

  if (isLoading || pricingLoading) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading pricing information...</span>
      </div>
    );
  }

  if (pricingError) {
    return (
      <div className={`${className} p-4`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-700 text-sm">
            Error loading pricing: {pricingError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <nav className={`${className} space-y-2`}>
      {sidebarItems.map((item, index) => (
        <SidebarItem
          key={index}
          item={item}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </nav>
  );
};

interface SidebarItemProps {
  item: LegacySidebarItem;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = item.icon;

  const handleClick = () => {
    if (item.expandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  const isLocked = Boolean(
    item.isLocked || (item.requiredPackage && !item.hasAccess)
  );

  return (
    <div className="sidebar-item">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
          isLocked
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
        }`}
        disabled={isLocked}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
          {item.requiredPackage && (
            <RequiredPackageBadge
              packageName={item.requiredPackage.name}
              minPrice={item.requiredPackage.minPrice}
              isLocked={isLocked}
            />
          )}
        </div>
        {item.expandable && (
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isExpanded && item.subItems && (
        <div className="ml-8 mt-2 space-y-1">
          {item.subItems.map((subItem, subIndex) => (
            <SubItem key={subIndex} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

interface SubItemProps {
  item: {
    label: string;
    translationKey?: string;
    requiredPackage?: {
      minPrice: number;
      name: string;
      excludeFromPremiumPlus?: boolean;
    };
  };
}

const SubItem: React.FC<SubItemProps> = ({ item }) => {
  const isLocked = Boolean(item.requiredPackage); // Simplified for demo

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md transition-colors ${
        isLocked
          ? 'bg-gray-50 text-gray-400'
          : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800'
      }`}
    >
      <span className="text-sm">{item.label}</span>
      {item.requiredPackage && (
        <RequiredPackageBadge
          packageName={item.requiredPackage.name}
          minPrice={item.requiredPackage.minPrice}
          isLocked={isLocked}
          size="sm"
        />
      )}
    </div>
  );
};

interface RequiredPackageBadgeProps {
  packageName: string;
  minPrice: number;
  isLocked: boolean;
  size?: 'sm' | 'md';
}

const RequiredPackageBadge: React.FC<RequiredPackageBadgeProps> = ({
  packageName,
  minPrice,
  isLocked,
  size = 'md',
}) => {
  const baseClasses = `inline-flex items-center rounded-full font-medium ${
    size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'
  }`;

  const colorClasses = isLocked
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {packageName}
      {minPrice > 0 && (
        <span className="ml-1 font-semibold">${minPrice.toFixed(2)}</span>
      )}
    </span>
  );
};

export default DynamicSidebar;
