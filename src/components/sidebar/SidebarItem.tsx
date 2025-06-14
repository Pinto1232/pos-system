import React from 'react';
import { ListItem, ListItemText, ListItemIcon, Tooltip } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { SidebarItemProps } from './types';
import SubItems from './SubItems';
import { useTranslation } from 'react-i18next';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import FeatureGuard from '@/components/common/FeatureGuard';
import {
  getListItemStyles,
  getListItemIconStyles,
  getListItemTextStyles,
  getChevronRightStyles,
} from './sharedStyles';

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isExpanded,
  iconColor,
  textColor,
  onToggle,
  onItemClick,
  onSettingsClick,
  isCollapsed = false,
}) => {
  const { t } = useTranslation();
  const { hasFeatureAccess } = useUserSubscription();

  const requiresAccess =
    item.requiresFeatureAccess !== false && item.label !== 'Dashboard';
  const hasAccess = !requiresAccess || hasFeatureAccess(item.label);
  const handleClick = () => {
    if (item.label === 'Settings' && onSettingsClick) {
      const queryClient = window.queryClient;
      if (queryClient) {
        queryClient.prefetchQuery({
          queryKey: ['userCustomization', 'current-user'],
          queryFn: async () => {
            try {
              const response = await fetch(
                '/api/UserCustomization/current-user'
              );
              if (response.ok) {
                return response.json();
              }
              throw new Error('Failed to fetch customization');
            } catch (error) {
              console.warn(
                'Prefetch failed, falling back to mock data:',
                JSON.stringify(error, null, 2)
              );
              return import('@/api/mockUserCustomization').then((module) =>
                module.mockFetchCustomization('current-user')
              );
            }
          },
          staleTime: 60000,
        });
      }

      setTimeout(() => {
        onSettingsClick();
      }, 10);
    } else if (item.expandable) {
      onToggle(item.label);
    } else {
      onItemClick(item.label);
    }
  };

  const listItem = (
    <ListItem
      onClick={handleClick}
      sx={{
        ...getListItemStyles(isActive),
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}
    >
      <ListItemIcon
        sx={getListItemIconStyles(isActive, iconColor, isCollapsed)}
      >
        <item.icon />
      </ListItemIcon>

      {!isCollapsed && (
        <>
          <ListItemText
            primary={item.translationKey ? t(item.translationKey) : item.label}
            sx={getListItemTextStyles(isActive, textColor)}
          />
          {isActive && <ChevronRight sx={getChevronRightStyles()} />}
          {item.expandable &&
            (isExpanded ? (
              <ExpandLess
                sx={{
                  transition: 'transform 0.3s ease',
                  transform: 'rotate(0deg)',
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  transition: 'transform 0.3s ease',
                  transform: 'rotate(0deg)',
                }}
              />
            ))}
        </>
      )}
    </ListItem>
  );

  const sidebarContent = (
    <>
      {isCollapsed ? (
        <Tooltip
          title={item.translationKey ? t(item.translationKey) : item.label}
          placement="right"
          arrow
          enterDelay={500}
          sx={{
            '& .MuiTooltip-tooltip': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              fontSize: '0.85rem',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            '& .MuiTooltip-arrow': {
              color: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          {listItem}
        </Tooltip>
      ) : (
        listItem
      )}

      {!isCollapsed && item.expandable && item.subItems && (
        <SubItems
          parentLabel={item.label}
          subItems={item.subItems}
          isExpanded={isExpanded}
          activeItem={isActive ? item.label : ''}
          textColor={textColor}
          onItemClick={onItemClick}
        />
      )}
    </>
  );

  if (requiresAccess && !hasAccess) {
    return (
      <FeatureGuard
        featureName={item.label}
        mode="overlay"
        size="medium"
        tooltipPlacement="right"
      >
        {sidebarContent}
      </FeatureGuard>
    );
  }

  return sidebarContent;
};

export default SidebarItem;
