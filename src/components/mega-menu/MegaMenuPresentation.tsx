'use client';
import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Fade,
  Grid,
  Paper,
  Popper,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import { MegaMenuItem, MegaMenuProps } from './types';
import Image from 'next/image';
import Link from 'next/link';
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  NewReleases,
  Bolt,
  Star,
} from '@mui/icons-material';
import {
  FiArrowRight,
  FiTrendingUp,
  FiZap,
  FiAward,
  FiShield,
  FiClock,
} from 'react-icons/fi';
import { TranslatedText } from '@/i18n';
import styles from './MegaMenu.module.css';

interface MegaMenuPresentationProps extends MegaMenuProps {
  activeItem: MegaMenuItem | null;
  anchorEl: HTMLElement | null;
  handleItemClick: (
    event: React.MouseEvent<HTMLElement>,
    item: MegaMenuItem
  ) => void;
  handleItemMouseEnter: (
    event: React.MouseEvent<HTMLElement>,
    item: MegaMenuItem
  ) => void;
  handleMenuMouseLeave: () => void;
  handleItemClose: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MegaMenuPresentation: React.FC<MegaMenuPresentationProps> = ({
  items,
  activeItem,
  anchorEl,
  handleItemClick,
  handleItemMouseEnter,
  handleMenuMouseLeave,
  handleItemClose,
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const open = Boolean(anchorEl);
  const id = open ? 'mega-menu-popper' : undefined;

  const renderDesktopMenu = () => (
    <Box className={styles.menuContainer} onMouseLeave={handleMenuMouseLeave}>
      {items.map((item) => (
        <Button
          key={item.id}
          className={`${styles.menuButton} ${activeItem?.id === item.id ? styles.active : ''}`}
          onClick={(e) => handleItemClick(e, item)}
          onMouseEnter={(e) => handleItemMouseEnter(e, item)}
          endIcon={
            item.columns ? (
              <KeyboardArrowDown
                fontSize="small"
                sx={{ color: 'white', opacity: 0.8, ml: -0.5 }}
              />
            ) : undefined
          }
        >
          {item.icon && <Box className={styles.menuIcon}>{item.icon}</Box>}
          <Typography variant="body1" className={styles.menuText}>
            {item.translationKey ? (
              <TranslatedText
                i18nKey={item.translationKey}
                defaultValue={item.title}
              />
            ) : (
              item.title
            )}
          </Typography>
        </Button>
      ))}

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        transition
        className={styles.menuPopper}
        style={{ width: '100vw' }}
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: false,
          },
          {
            name: 'flip',
            enabled: false,
          },
          {
            name: 'computeStyles',
            options: {
              adaptive: false,
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              className={styles.menuPaper}
              onMouseLeave={handleMenuMouseLeave}
              onMouseEnter={() => {}}
            >
              {activeItem?.columns && (
                <Grid container spacing={2} className={styles.menuGrid}>
                  {activeItem.columns.map((column) => (
                    <Grid
                      item
                      xs={12}
                      md={activeItem.featured ? 3 : 4}
                      key={column.id}
                    >
                      <Typography
                        variant="subtitle1"
                        className={styles.columnTitle}
                      >
                        {column.title}
                      </Typography>
                      <List className={styles.columnList}>
                        {column.items.map((subItem, index) => (
                          <Tooltip
                            title={subItem.description || ''}
                            placement="right"
                            arrow
                            key={subItem.id}
                          >
                            <ListItem
                              component={Link}
                              href={subItem.link}
                              className={styles.subItem}
                            >
                              <ListItemIcon className={styles.subItemIcon}>
                                {subItem.icon ||
                                  (index % 5 === 0 ? (
                                    <FiTrendingUp size={20} />
                                  ) : index % 5 === 1 ? (
                                    <FiZap size={20} />
                                  ) : index % 5 === 2 ? (
                                    <FiAward size={20} />
                                  ) : index % 5 === 3 ? (
                                    <FiShield size={20} />
                                  ) : (
                                    <FiClock size={20} />
                                  ))}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    className={styles.subItemPrimary}
                                  >
                                    {subItem.title}
                                  </Typography>
                                }
                                secondary={
                                  subItem.description && (
                                    <Typography
                                      variant="caption"
                                      className={styles.subItemSecondary}
                                    >
                                      {subItem.description.length > 60
                                        ? `${subItem.description.substring(0, 60)}...`
                                        : subItem.description}
                                    </Typography>
                                  )
                                }
                                className={styles.subItemText}
                              />
                              {subItem.badge && (
                                <Chip
                                  label={subItem.badge.text}
                                  color={subItem.badge.color}
                                  size="small"
                                  className={styles.subItemBadge}
                                  icon={
                                    subItem.badge.text
                                      .toLowerCase()
                                      .includes('new') ? (
                                      <NewReleases fontSize="small" />
                                    ) : undefined
                                  }
                                />
                              )}
                              <FiArrowRight
                                className={styles.subItemArrow}
                                size={16}
                              />
                            </ListItem>
                          </Tooltip>
                        ))}
                      </List>
                    </Grid>
                  ))}

                  {activeItem.featured && (
                    <Grid item xs={12} md={3}>
                      <Box className={styles.featuredContainer}>
                        <Box className={styles.featuredContent}>
                          <Box className={styles.featuredTitleWrapper}>
                            <Star className={styles.featuredTitleIcon} />
                            <Typography
                              variant="h6"
                              className={styles.featuredTitle}
                            >
                              {activeItem.featured.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            className={styles.featuredDescription}
                          >
                            {activeItem.featured.description}
                          </Typography>
                          <Box className={styles.featuredImageContainer}>
                            <Box className={styles.featuredImageOverlay}>
                              <Bolt className={styles.featuredImageIcon} />
                            </Box>
                            <Image
                              src={activeItem.featured.image}
                              alt={activeItem.featured.title}
                              fill
                              className={styles.featuredImage}
                              sizes="(max-width: 768px) 100vw, 300px"
                              priority
                            />
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            href={activeItem.featured.link}
                            className={styles.featuredButton}
                            endIcon={<FiArrowRight size={16} />}
                          >
                            {activeItem.featured.linkText}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );

  const renderMobileMenu = () => (
    <Box className={styles.mobileMenuContainer}>
      <IconButton
        onClick={toggleMobileMenu}
        className={styles.mobileMenuToggle}
        aria-label="Toggle menu"
      >
        <Typography variant="body1" className={styles.mobileMenuText}>
          Menu
        </Typography>
        <KeyboardArrowDown
          className={`${styles.mobileMenuIcon} ${isMobileMenuOpen ? styles.rotated : ''}`}
        />
      </IconButton>

      <Collapse in={isMobileMenuOpen} timeout="auto" unmountOnExit>
        <Paper className={styles.mobileMenuPaper}>
          {items.map((item) => (
            <Box key={item.id} className={styles.mobileMenuItem}>
              {item.link ? (
                <Button
                  component={Link}
                  href={item.link}
                  className={styles.mobileMenuButton}
                  fullWidth
                  onClick={handleItemClose}
                >
                  {item.icon && (
                    <Box className={styles.mobileMenuItemIcon}>{item.icon}</Box>
                  )}
                  <Typography variant="body1">
                    {item.translationKey ? (
                      <TranslatedText
                        i18nKey={item.translationKey}
                        defaultValue={item.title}
                      />
                    ) : (
                      item.title
                    )}
                  </Typography>
                </Button>
              ) : (
                <Typography
                  variant="subtitle1"
                  className={styles.mobileMenuCategory}
                >
                  {item.translationKey ? (
                    <TranslatedText
                      i18nKey={item.translationKey}
                      defaultValue={item.title}
                    />
                  ) : (
                    item.title
                  )}
                </Typography>
              )}

              {item.columns && (
                <Box className={styles.mobileSubmenu}>
                  {item.columns.map((column) => (
                    <Box key={column.id} className={styles.mobileSubmenuColumn}>
                      <Typography
                        variant="subtitle2"
                        className={styles.mobileColumnTitle}
                      >
                        {column.title}
                      </Typography>
                      <List>
                        {column.items.map((subItem) => (
                          <ListItem
                            key={subItem.id}
                            component={Link}
                            href={subItem.link}
                            className={styles.mobileSubItem}
                            onClick={handleItemClose}
                          >
                            {subItem.icon && (
                              <ListItemIcon
                                className={styles.mobileSubItemIcon}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={subItem.title}
                              secondary={subItem.description}
                              className={styles.mobileSubItemText}
                            />
                            {subItem.badge && (
                              <Chip
                                label={subItem.badge.text}
                                color={subItem.badge.color}
                                size="small"
                                className={styles.mobileSubItemBadge}
                              />
                            )}
                            <KeyboardArrowRight
                              className={styles.mobileSubItemArrow}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}

                  {item.featured && (
                    <Box className={styles.mobileFeatured}>
                      <Typography
                        variant="subtitle2"
                        className={styles.mobileFeaturedTitle}
                      >
                        {item.featured.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.mobileFeaturedDescription}
                      >
                        {item.featured.description}
                      </Typography>
                      <Box className={styles.mobileFeaturedImageContainer}>
                        <Image
                          src={item.featured.image}
                          alt={item.featured.title}
                          width={150}
                          height={100}
                          className={styles.mobileFeaturedImage}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        href={item.featured.link}
                        className={styles.mobileFeaturedButton}
                        onClick={handleItemClose}
                        fullWidth
                      >
                        {item.featured.linkText}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      </Collapse>
    </Box>
  );

  return isMobile ? renderMobileMenu() : renderDesktopMenu();
};

export default MegaMenuPresentation;
