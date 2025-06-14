import React, { useMemo, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { SubItemsProps } from './types';
import FeatureGuard from '@/components/common/FeatureGuard';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import { useTranslation } from 'react-i18next';
import {
  getListItemStyles,
  getListItemIconStyles,
  getListItemTextStyles,
  getChevronRightStyles,
} from './sharedStyles';

const SubItems: React.FC<SubItemsProps> = ({
  parentLabel,
  subItems,
  isExpanded,
  textColor,
  onItemClick,
  activeItem,
}) => {
  const { t } = useTranslation();
  const { hasFeatureAccess } = useUserSubscription();
  const [activeSubItem, setActiveSubItem] = React.useState<string>(() => {
    try {
      const savedActiveItem = localStorage.getItem('sidebarActiveItem');
      if (
        savedActiveItem &&
        subItems.some((item) => item.label === savedActiveItem)
      ) {
        return savedActiveItem;
      }
    } catch (error) {
      console.error(
        'Error reading from localStorage:',
        JSON.stringify(error, null, 2)
      );
    }
    return activeItem || '';
  });

  // Update activeSubItem when activeItem prop changes
  React.useEffect(() => {
    if (activeItem && subItems.some((item) => item.label === activeItem)) {
      setActiveSubItem(activeItem);
    }
  }, [activeItem, subItems]);

  const handleSubItemClick = useCallback(
    (label: string) => {
      onItemClick(label, parentLabel);
      setActiveSubItem(label);
      // Save to localStorage (redundant but for safety)
      localStorage.setItem('sidebarActiveItem', label);
    },
    [onItemClick, parentLabel]
  );

  const collapseEasing = useMemo(
    () => ({
      enter: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      exit: 'cubic-bezier(0.34, 0.01, 0.64, 1)',
    }),
    []
  );

  const collapseSx = useMemo(
    () => ({
      transition: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1) !important',
      '& .MuiCollapse-wrapper': {
        transitionProperty: 'height, opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
      },
    }),
    [isExpanded]
  );

  const listSx = useMemo(
    () => ({
      padding: '4px 8px',
      marginLeft: '8px',
      borderLeft: `1px dashed ${textColor ? `${textColor}40` : 'rgba(255, 255, 255, 0.2)'}`,
    }),
    [textColor]
  );

  return (
    <Collapse
      in={isExpanded}
      timeout={700}
      easing={collapseEasing}
      sx={collapseSx}
      unmountOnExit
    >
      <List component="div" disablePadding sx={listSx}>
        {subItems.map((subItem) => {
          const requiresAccess = subItem.requiresFeatureAccess !== false;
          const hasAccess = !requiresAccess || hasFeatureAccess(subItem.label);

          const subItemContent = (
            <ListItem
              key={subItem.label}
              sx={getListItemStyles(activeSubItem === subItem.label, true)}
              onClick={() => handleSubItemClick(subItem.label)}
            >
              <ListItemIcon
                sx={getListItemIconStyles(
                  activeSubItem === subItem.label,
                  textColor || 'rgba(255, 255, 255, 0.7)',
                  false,
                  true
                )}
              >
                <FiberManualRecordIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  subItem.translationKey
                    ? t(subItem.translationKey)
                    : subItem.label
                }
                sx={getListItemTextStyles(
                  activeSubItem === subItem.label,
                  textColor || 'rgba(255, 255, 255, 0.9)',
                  true
                )}
              />
              {activeSubItem === subItem.label && (
                <ChevronRight sx={getChevronRightStyles()} />
              )}
            </ListItem>
          );

          if (requiresAccess && !hasAccess) {
            return (
              <FeatureGuard
                key={subItem.label}
                featureName={subItem.label}
                mode="overlay"
                size="small"
                tooltipPlacement="right"
              >
                {subItemContent}
              </FeatureGuard>
            );
          }

          return <div key={subItem.label}>{subItemContent}</div>;
        })}
      </List>
    </Collapse>
  );
};

export default React.memo(SubItems);
