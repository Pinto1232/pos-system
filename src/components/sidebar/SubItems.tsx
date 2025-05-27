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
import SubItemFeatureGuard from './SubItemFeatureGuard';

const SubItems: React.FC<SubItemsProps> = ({
  parentLabel,
  subItems,
  isExpanded,
  textColor,
  onItemClick,
  activeItem,
}) => {
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
        {subItems.map((subItem) => (
          <SubItemFeatureGuard key={subItem.label} featureName={subItem.label}>
            <ListItem
              key={subItem.label}
              sx={{
                pl: 3,
                cursor: 'pointer',
                backgroundColor:
                  activeSubItem === subItem.label
                    ? 'rgba(52, 211, 153, 0.9)'
                    : 'rgba(204, 217, 255, 0.1)',
                '&:hover': {
                  backgroundColor:
                    activeSubItem === subItem.label
                      ? 'rgba(52, 211, 153, 0.95)'
                      : 'rgba(235, 242, 255, 0.2)',
                  transform: 'translateX(4px)',
                  boxShadow:
                    activeSubItem === subItem.label
                      ? '0 4px 12px rgba(52, 211, 153, 0.25)'
                      : 'none',
                },
                borderRadius: '10px',
                margin: '4px 0',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow:
                  activeSubItem === subItem.label
                    ? '0 2px 8px rgba(52, 211, 153, 0.2)'
                    : 'none',
              }}
              onClick={() => handleSubItemClick(subItem.label)}
            >
              <ListItemIcon
                sx={{
                  minWidth: '30px',
                  color:
                    activeSubItem === subItem.label
                      ? '#fff'
                      : textColor || 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <FiberManualRecordIcon
                  sx={{
                    fontSize: '6px',
                    transition: 'transform 0.3s ease',
                    transform:
                      activeSubItem === subItem.label
                        ? 'scale(1.3)'
                        : 'scale(1)',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={subItem.label}
                sx={{
                  color:
                    activeSubItem === subItem.label
                      ? '#fff'
                      : textColor || 'rgba(255, 255, 255, 0.9)',
                  '& .MuiTypography-root': {
                    fontWeight: activeSubItem === subItem.label ? 600 : 400,
                    fontSize: '0.9rem',
                  },
                }}
              />
              {activeSubItem === subItem.label && (
                <ChevronRight
                  sx={{
                    color: '#fff',
                    animation: 'pulseRight 1.5s infinite ease-in-out',
                    '@keyframes pulseRight': {
                      '0%': {
                        transform: 'translateX(0)',
                      },
                      '50%': {
                        transform: 'translateX(3px)',
                      },
                      '100%': {
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                />
              )}
            </ListItem>
          </SubItemFeatureGuard>
        ))}
      </List>
    </Collapse>
  );
};

export default React.memo(SubItems);
