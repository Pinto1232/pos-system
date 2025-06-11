'use client';
import React, { useState, useCallback } from 'react';
import { MegaMenuItem, MegaMenuProps } from './types';
import MegaMenuPresentation from './MegaMenuPresentation';

const MegaMenuContainer: React.FC<MegaMenuProps> = ({ items, onItemClick }) => {
  const [activeItem, setActiveItem] = useState<MegaMenuItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleItemMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: MegaMenuItem) => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (item.link) {
        return;
      }

      setActiveItem(item);
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveItem(null);
      setAnchorEl(null);
    }, 300);
  }, []);

  const handleItemClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: MegaMenuItem) => {
      if (item.link) {
        if (onItemClick) {
          onItemClick(item);
        }
      } else if (onItemClick) {
        onItemClick(item);
      }
    },
    [onItemClick]
  );

  const handleItemClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <MegaMenuPresentation
      items={items}
      activeItem={activeItem}
      anchorEl={anchorEl}
      handleItemClick={handleItemClick}
      handleItemMouseEnter={handleItemMouseEnter}
      handleMenuMouseLeave={handleMenuMouseLeave}
      handleItemClose={handleItemClose}
      isMobileMenuOpen={isMobileMenuOpen}
      toggleMobileMenu={toggleMobileMenu}
      onItemClick={onItemClick}
    />
  );
};

export default MegaMenuContainer;
