import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { SidebarItemProps } from './types';
import SubItems from './SubItems';

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
  const handleClick = () => {
    if (
      item.label === 'Settings' &&
      onSettingsClick
    ) {
      // Pre-fetch customization data before opening settings modal
      // to reduce perceived loading time
      const queryClient = window.queryClient;
      if (queryClient) {
        queryClient.prefetchQuery({
          queryKey: [
            'userCustomization',
            'current-user',
          ],
          queryFn: async () => {
            try {
              const response = await fetch(
                '/api/UserCustomization/current-user'
              );
              if (response.ok) {
                return response.json();
              }
              throw new Error(
                'Failed to fetch customization'
              );
            } catch (error) {
              console.warn(
                'Prefetch failed, falling back to mock data:',
                error
              );
              return import(
                '@/api/mockUserCustomization'
              ).then((module) =>
                module.mockFetchCustomization(
                  'current-user'
                )
              );
            }
          },
          staleTime: 60000,
        });
      }

      // Small timeout to allow prefetch to start
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
        cursor: 'pointer',
        backgroundColor: isActive
          ? 'rgba(52, 211, 153, 0.9)'
          : 'inherit',
        '&:hover': {
          backgroundColor: isActive
            ? 'rgba(52, 211, 153, 0.95)'
            : 'rgba(255, 255, 255, 0.1)',
          transform: 'translateX(4px)',
          boxShadow: isActive
            ? '0 4px 12px rgba(52, 211, 153, 0.25)'
            : 'none',
        },
        transition: 'all 0.3s ease-in-out',
        justifyContent: isCollapsed
          ? 'center'
          : 'flex-start',
        py: 1.5,
        borderRadius: '12px',
        margin: '4px 8px',
        transition:
          'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isActive
          ? '0 2px 8px rgba(52, 211, 153, 0.2)'
          : 'none',
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive ? '#fff' : iconColor,
          minWidth: isCollapsed ? 0 : '36px',
          mr: isCollapsed ? 0 : 2,
          justifyContent: 'center',
          '& > *': {
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
            transform: isActive
              ? 'scale(1.1)'
              : 'scale(1)',
          },
        }}
      >
        <item.icon />
      </ListItemIcon>

      {!isCollapsed && (
        <>
          <ListItemText
            primary={item.label}
            sx={{
              color: isActive
                ? '#fff'
                : textColor,
              opacity: 1,
              transition: 'all 0.3s ease',
              '& .MuiTypography-root': {
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem',
              },
            }}
          />
          {isActive && (
            <ChevronRight
              sx={{
                color: '#fff',
                animation:
                  'pulseRight 1.5s infinite ease-in-out',
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
          {item.expandable &&
            (isExpanded ? (
              <ExpandLess
                sx={{
                  transition:
                    'transform 0.3s ease',
                  transform: 'rotate(0deg)',
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  transition:
                    'transform 0.3s ease',
                  transform: 'rotate(0deg)',
                }}
              />
            ))}
        </>
      )}
    </ListItem>
  );

  return (
    <>
      {isCollapsed ? (
        <Tooltip
          title={item.label}
          placement="right"
          arrow
          enterDelay={500}
          sx={{
            '& .MuiTooltip-tooltip': {
              backgroundColor:
                'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              fontSize: '0.85rem',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow:
                '0 4px 12px rgba(0, 0, 0, 0.15)',
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

      {!isCollapsed &&
        item.expandable &&
        item.subItems && (
          <SubItems
            parentLabel={item.label}
            subItems={item.subItems}
            isExpanded={isExpanded}
            activeItem={
              isActive ? item.label : ''
            }
            textColor={textColor}
            onItemClick={onItemClick}
          />
        )}
    </>
  );
};

export default SidebarItem;
