import { SxProps, Theme } from '@mui/material';

export const ACTIVE_COLORS = {
  background: 'rgba(52, 211, 153, 0.9)',
  backgroundHover: 'rgba(52, 211, 153, 0.95)',
  text: '#fff',
  boxShadow: '0 2px 8px rgba(52, 211, 153, 0.2)',
  boxShadowHover: '0 4px 12px rgba(52, 211, 153, 0.25)',
} as const;

export const INACTIVE_COLORS = {
  backgroundHover: 'rgba(255, 255, 255, 0.1)',
  subItemBackground: 'rgba(204, 217, 255, 0.1)',
  subItemBackgroundHover: 'rgba(235, 242, 255, 0.2)',
} as const;

export const ANIMATIONS = {
  pulseRight: {
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
  },
} as const;

export const TRANSITIONS = {
  all: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 0.3s ease',
} as const;

export const getListItemStyles = (
  isActive: boolean,
  isSubItem: boolean = false
): SxProps<Theme> => ({
  cursor: 'pointer',
  backgroundColor: isActive
    ? ACTIVE_COLORS.background
    : isSubItem
      ? INACTIVE_COLORS.subItemBackground
      : 'inherit',
  '&:hover': {
    backgroundColor: isActive
      ? ACTIVE_COLORS.backgroundHover
      : isSubItem
        ? INACTIVE_COLORS.subItemBackgroundHover
        : INACTIVE_COLORS.backgroundHover,
    transform: 'translateX(4px)',
    boxShadow: isActive ? ACTIVE_COLORS.boxShadowHover : 'none',
  },
  transition: TRANSITIONS.all,
  borderRadius: isSubItem ? '10px' : '12px',
  margin: isSubItem ? '4px 0' : '4px 8px',
  boxShadow: isActive ? ACTIVE_COLORS.boxShadow : 'none',
  py: isSubItem ? 1 : 1.5,
  pl: isSubItem ? 3 : undefined,
});

export const getListItemIconStyles = (
  isActive: boolean,
  iconColor: string,
  isCollapsed: boolean = false,
  isSubItem: boolean = false
): SxProps<Theme> => ({
  color: isActive ? ACTIVE_COLORS.text : iconColor,
  minWidth: isSubItem ? '30px' : isCollapsed ? 0 : '36px',
  mr: isCollapsed ? 0 : 2,
  justifyContent: 'center',
  '& > *': isSubItem
    ? {
        fontSize: '6px',
        transition: TRANSITIONS.transform,
        transform: isActive ? 'scale(1.3)' : 'scale(1)',
      }
    : {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: TRANSITIONS.transform,
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
      },
});

export const getListItemTextStyles = (
  isActive: boolean,
  textColor: string,
  isSubItem: boolean = false
): SxProps<Theme> => ({
  color: isActive ? ACTIVE_COLORS.text : textColor,
  opacity: 1,
  transition: TRANSITIONS.all,
  '& .MuiTypography-root': {
    fontWeight: isActive ? 600 : 400,
    fontSize: isSubItem ? '0.9rem' : '0.95rem',
  },
});

export const getChevronRightStyles = (): SxProps<Theme> => ({
  color: ACTIVE_COLORS.text,
  animation: 'pulseRight 1.5s infinite ease-in-out',
  ...ANIMATIONS.pulseRight,
});
