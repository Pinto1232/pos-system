'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTierAccess } from '@/hooks/useTierAccess';
import { useSidebarAccess } from '@/hooks/useSidebarAccess';
import { sidebarItems } from '@/Seetings/settings';
import TierUpgradePrompt from '@/components/dashboard/TierUpgradePrompt';

const TierAccessDemo: React.FC = () => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const { currentTierLevel, currentTierName, getCurrentPackageInfo } =
    useTierAccess();
  const { filterSidebarItems, checkItemAccess } = useSidebarAccess();

  const currentPackage = getCurrentPackageInfo();
  const filteredItems = filterSidebarItems(sidebarItems);

  const handleUpgrade = (tierLevel: number) => {
    console.log(`Upgrading to tier ${tierLevel}`);
    setUpgradeDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tier Access System Demo
      </Typography>

      {}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Subscription
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Tier Level:</strong> {currentTierLevel}
              </Typography>
              <Typography variant="body1">
                <strong>Tier Name:</strong> {currentTierName}
              </Typography>
              <Typography variant="body1">
                <strong>Package:</strong> {currentPackage.name}
              </Typography>
              <Typography variant="body1">
                <strong>Min Price:</strong> ${currentPackage.minPrice}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={() => setUpgradeDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                Test Upgrade Modal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sidebar Items Access Control
          </Typography>
          <List>
            {filteredItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {item.isLocked ? (
                      <LockIcon color="error" />
                    ) : (
                      <CheckIcon color="success" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: item.isLocked
                              ? 'line-through'
                              : 'none',
                            opacity: item.isLocked ? 0.6 : 1,
                          }}
                        >
                          {item.label}
                        </Typography>
                        {item.requiredPackage && (
                          <Chip
                            label={`${item.requiredPackage.name} ($${item.requiredPackage.minPrice})`}
                            size="small"
                            color={item.isLocked ? 'error' : 'success'}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      item.isLocked
                        ? `Requires ${item.requiredUpgrade?.name} package`
                        : 'Access granted'
                    }
                  />
                </ListItem>

                {}
                {item.subItems && item.subItems.length > 0 && (
                  <Box sx={{ ml: 4 }}>
                    {item.subItems.map((subItem, subIndex) => {
                      const hasSubAccess = checkItemAccess(
                        subItem.requiredPackage
                      );
                      return (
                        <ListItem key={subIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {hasSubAccess ? (
                              <CheckIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: !hasSubAccess
                                      ? 'line-through'
                                      : 'none',
                                    opacity: !hasSubAccess ? 0.6 : 1,
                                  }}
                                >
                                  {subItem.label}
                                </Typography>
                                {subItem.requiredPackage && (
                                  <Chip
                                    label={`${subItem.requiredPackage.name} ($${subItem.requiredPackage.minPrice})`}
                                    size="small"
                                    color={hasSubAccess ? 'success' : 'error'}
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                )}

                {index < filteredItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {}
      <TierUpgradePrompt
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        currentTierLevel={currentTierLevel}
        onUpgrade={handleUpgrade}
      />
    </Box>
  );
};

export default TierAccessDemo;
