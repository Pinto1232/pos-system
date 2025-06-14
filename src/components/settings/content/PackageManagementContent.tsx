import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Box,
  Typography,
  Paper,
  Button as MuiButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useCurrency } from '@/contexts/CurrencyContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import styles from '@/components/pricing-packages/PricingPackages.module.css';
import settingsStyles from '@/Seetings/SettingsModalPackages.module.css';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card/Card';
import { Button } from '@/components/ui/button/Button';
import iconMap from '@/utils/icons';
import { TranslatedText } from '@/i18n';
import { Package, Subscription } from '@/types/settingsTypes';

interface PackageManagementContentProps {
  packages: Package[] | undefined;
  isLoading?: boolean;
  error?: Error | null;
  refetchPackages?: () => void;
  subscription: Subscription | null;
  availableFeatures?: string[];
  enableAdditionalPackage: (packageId: number) => Promise<void>;
  disableAdditionalPackage: (packageId: number) => Promise<void>;
}

const PackageManagementContent: React.FC<PackageManagementContentProps> = ({
  packages: initialPackages,
  isLoading: externalIsLoading,
  error: externalError,
  refetchPackages,
  subscription,

  enableAdditionalPackage,
  disableAdditionalPackage,
}) => {
  const { currency, rate, formatPrice, currencySymbol } = useCurrency();
  const {
    getSavedPackage,
    isPurchasedPackage,
    selectPackage: selectPackageInContext,
  } = usePackageSelection();
  const { testPeriod } = useTestPeriod();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(
    externalIsLoading || true
  );
  const [error, setError] = useState<string | null>(
    externalError ? externalError.message : null
  );
  const [processingPackageId, setProcessingPackageId] = useState<number | null>(
    null
  );
  const [savedPackage, setSavedPackage] = useState<Package | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [nextBillingDate, setNextBillingDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const TIMER_STATE_KEY = 'testPeriodTimerState';

  const SELECTED_PACKAGE_DATA_KEY = 'testPeriodSelectedPackageData';
  const TIMER_LAST_UPDATED_KEY = 'timerLastUpdated';
  const PURCHASE_DATE_KEY = 'packagePurchaseDate';

  const safeLocalStorage = useMemo(
    () => ({
      getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error(`Error reading ${key} from localStorage:`, error);
          return null;
        }
      },
      setItem: (key: string, value: string): boolean => {
        if (typeof window === 'undefined') return false;
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error(`Error writing ${key} to localStorage:`, error);
          return false;
        }
      },
    }),
    []
  );

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      console.log(
        '[PACKAGE MANAGEMENT] Using initial packages:',
        initialPackages.length
      );

      initialPackages.forEach((pkg) => {
        console.log(`[PACKAGE MANAGEMENT] Initial Package: ${pkg.title}`, {
          id: pkg.id,
          price: pkg.price,
          currency: pkg.currency,
          multiCurrencyPrices: pkg.multiCurrencyPrices,
          type: pkg.type,
        });
      });

      setPackages(initialPackages);
      setIsLoading(false);
      setError(null);
    }
  }, [initialPackages]);

  useEffect(() => {
    if (externalIsLoading !== undefined) {
      setIsLoading(externalIsLoading);
    }
  }, [externalIsLoading]);

  useEffect(() => {
    if (externalError) {
      setError(externalError.message);
    }
  }, [externalError]);

  useEffect(() => {
    const savedPkg = getSavedPackage();
    if (savedPkg) {
      console.log('[PACKAGE MANAGEMENT] Loaded saved package:', savedPkg.title);
      setSavedPackage(savedPkg);
    }

    const storedTimerState = safeLocalStorage.getItem(TIMER_STATE_KEY);
    const storedPackageData = safeLocalStorage.getItem(
      SELECTED_PACKAGE_DATA_KEY
    );
    const storedPurchaseDate = safeLocalStorage.getItem(PURCHASE_DATE_KEY);

    if (storedTimerState) {
      try {
        const parsedTimerState = JSON.parse(storedTimerState);
        if (typeof parsedTimerState === 'number' && parsedTimerState > 0) {
          const lastUpdated = safeLocalStorage.getItem(TIMER_LAST_UPDATED_KEY);
          if (lastUpdated) {
            const elapsedSeconds = Math.floor(
              (Date.now() - parseInt(lastUpdated)) / 1000
            );
            const adjustedTime = Math.max(0, parsedTimerState - elapsedSeconds);
            setRemainingTime(adjustedTime);
            console.log(
              `[PACKAGE MANAGEMENT] Timer restored: ${formatTime(adjustedTime)}`
            );
          } else {
            setRemainingTime(parsedTimerState);
          }
        }
      } catch (error) {
        console.error(
          '[PACKAGE MANAGEMENT] Error parsing stored timer state:',
          error
        );
      }
    } else if (testPeriod > 0) {
      const initialTime = testPeriod * 24 * 60 * 60;
      setRemainingTime(initialTime);
    }

    if (storedPurchaseDate) {
      try {
        const parsedDate = new Date(JSON.parse(storedPurchaseDate));
        if (!isNaN(parsedDate.getTime())) {
          setPurchaseDate(parsedDate);

          const nextBilling = new Date(parsedDate);
          nextBilling.setDate(nextBilling.getDate() + 30);
          setNextBillingDate(nextBilling);
        }
      } catch (error) {
        console.error(
          '[PACKAGE MANAGEMENT] Error parsing purchase date:',
          error
        );
      }
    }

    if (storedPackageData) {
      try {
        const packageData = JSON.parse(storedPackageData);
        console.log(
          `[PACKAGE MANAGEMENT] Loaded package data: ${packageData.title}`
        );
      } catch (error) {
        console.error(
          '[PACKAGE MANAGEMENT] Error parsing package data:',
          error
        );
      }
    }
  }, [getSavedPackage, safeLocalStorage, testPeriod, formatTime]);

  const isProcessingEventRef = useRef<boolean>(false);
  const lastProcessedEventTimestampRef = useRef<number>(0);

  const handlePackageSelected = useCallback(
    (event: CustomEvent) => {
      console.log(
        '[PACKAGE MANAGEMENT] Package selection event received:',
        event.detail
      );

      if (
        isProcessingEventRef.current ||
        (event.detail && event.detail.fromSettingsModal)
      ) {
        console.log(
          '[PACKAGE MANAGEMENT] Skipping event processing to prevent loops'
        );
        return;
      }

      const eventTimestamp = event.detail?.timestamp || Date.now();
      if (eventTimestamp - lastProcessedEventTimestampRef.current < 1000) {
        console.log(
          '[PACKAGE MANAGEMENT] Debouncing event, too soon after last event'
        );
        return;
      }

      if (event.detail && event.detail.packageId) {
        const packageId = event.detail.packageId;
        const selectedPkg = packages.find((pkg) => pkg.id === packageId);
        const isCustomPackage = selectedPkg?.type?.includes('custom') || false;

        if (isCustomPackage) {
          console.log(
            '[PACKAGE MANAGEMENT] Custom package detected, using special handling'
          );

          const savedPkg = getSavedPackage();
          if (savedPkg) {
            setSavedPackage(savedPkg);
          }
          return;
        }

        isProcessingEventRef.current = true;
        lastProcessedEventTimestampRef.current = Date.now();

        console.log('[PACKAGE MANAGEMENT] Processing package selection event');

        Promise.resolve().then(async () => {
          if (refetchPackages && !event.detail.skipRefetch) {
            await refetchPackages();
          } else {
            console.log(
              '[PACKAGE MANAGEMENT] Skipping refetch due to skipRefetch flag'
            );
          }

          const savedPkg = getSavedPackage();
          if (savedPkg) {
            setSavedPackage(savedPkg);
          }

          setTimeout(() => {
            isProcessingEventRef.current = false;
          }, 500);
        });
      }
    },
    [refetchPackages, getSavedPackage, packages]
  );

  const handlePackageChanged = useCallback(
    (event: CustomEvent) => {
      console.log(
        '[PACKAGE MANAGEMENT] Package changed event received:',
        event.detail
      );

      if (
        isProcessingEventRef.current ||
        (event.detail && event.detail.fromSettingsModal)
      ) {
        console.log(
          '[PACKAGE MANAGEMENT] Skipping event processing to prevent loops'
        );
        return;
      }

      const eventTimestamp = event.detail?.timestamp || Date.now();
      if (eventTimestamp - lastProcessedEventTimestampRef.current < 1000) {
        console.log(
          '[PACKAGE MANAGEMENT] Debouncing event, too soon after last event'
        );
        return;
      }

      if (event.detail) {
        const packageId = event.detail.packageId;
        if (packageId) {
          const selectedPkg = packages.find((pkg) => pkg.id === packageId);
          const isCustomPackage =
            selectedPkg?.type?.includes('custom') || false;

          if (isCustomPackage) {
            console.log(
              '[PACKAGE MANAGEMENT] Custom package detected, using special handling'
            );

            const savedPkg = getSavedPackage();
            if (savedPkg) {
              setSavedPackage(savedPkg);
            }
            return;
          }
        }

        if (event.detail.skipRefetch) {
          console.log(
            '[PACKAGE MANAGEMENT] Skipping refetch due to skipRefetch flag'
          );

          const savedPkg = getSavedPackage();
          if (savedPkg) {
            setSavedPackage(savedPkg);
          }
          return;
        }

        isProcessingEventRef.current = true;
        lastProcessedEventTimestampRef.current = Date.now();

        console.log('[PACKAGE MANAGEMENT] Processing package changed event');

        Promise.resolve().then(async () => {
          if (refetchPackages) {
            await refetchPackages();
          }

          const savedPkg = getSavedPackage();
          if (savedPkg) {
            setSavedPackage(savedPkg);
          }

          setTimeout(() => {
            isProcessingEventRef.current = false;
          }, 500);
        });
      }
    },
    [refetchPackages, getSavedPackage, packages]
  );

  useEffect(() => {
    console.log('[PACKAGE MANAGEMENT] Setting up event listeners');

    window.addEventListener(
      'packageSelected',
      handlePackageSelected as EventListener
    );

    window.addEventListener(
      'packageChanged',
      handlePackageChanged as EventListener
    );

    return () => {
      console.log('[PACKAGE MANAGEMENT] Cleaning up event listeners');

      window.removeEventListener(
        'packageSelected',
        handlePackageSelected as EventListener
      );

      window.removeEventListener(
        'packageChanged',
        handlePackageChanged as EventListener
      );
    };
  }, [handlePackageSelected, handlePackageChanged]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;

        if (newTime > 0) {
          safeLocalStorage.setItem(TIMER_STATE_KEY, JSON.stringify(newTime));
          safeLocalStorage.setItem(
            TIMER_LAST_UPDATED_KEY,
            Date.now().toString()
          );

          if (newTime % 60 === 0) {
            console.log(
              `[PACKAGE MANAGEMENT] Timer update: ${formatTime(newTime)} remaining`
            );
          }
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [safeLocalStorage, formatTime]);

  useEffect(() => {
    if (!initialPackages || initialPackages.length === 0) {
      const fetchPackages = async () => {
        try {
          console.log(
            '[PACKAGE MANAGEMENT] Fetching packages directly from API'
          );
          setIsLoading(true);

          const response = await fetch('/api/PricingPackages');

          if (!response.ok) {
            throw new Error('Failed to fetch packages');
          }

          const data = await response.json();
          console.log('[PACKAGE MANAGEMENT] Raw API response:', data);

          let packageData: Package[] = [];
          if (data && data.data && Array.isArray(data.data)) {
            packageData = data.data;
            console.log(
              `[PACKAGE MANAGEMENT] Found ${packageData.length} packages in data.data`
            );
          } else if (Array.isArray(data)) {
            packageData = data;
            console.log(
              `[PACKAGE MANAGEMENT] Found ${packageData.length} packages in direct array`
            );
          }

          packageData.forEach((pkg) => {
            console.log(`[PACKAGE MANAGEMENT] API Package: ${pkg.title}`, {
              id: pkg.id,
              price: pkg.price,
              currency: pkg.currency,
              multiCurrencyPrices: pkg.multiCurrencyPrices,
              type: pkg.type,
            });
          });

          const uniquePackages = packageData.filter(
            (pkg, index, self) =>
              index === self.findIndex((p) => p.title === pkg.title)
          );

          console.log(
            `[PACKAGE MANAGEMENT] After filtering duplicates: ${uniquePackages.length} packages`
          );
          setPackages(uniquePackages);
          setError(null);
        } catch (err) {
          console.error('[PACKAGE MANAGEMENT] Error fetching packages:', err);
          setError('Failed to load packages. Using fallback data.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPackages();
    }
  }, [initialPackages]);

  const getPackagePrice = (pkg: Package) => {
    console.log(
      `[PACKAGE MANAGEMENT] Getting price for package: ${pkg.title}`,
      {
        initialPrice: pkg.price,
        currency: currency,
        pkgCurrency: pkg.currency,
        multiCurrencyPrices: pkg.multiCurrencyPrices,
        rate: rate,
      }
    );

    let displayPrice = pkg.price;

    if (pkg.type?.toLowerCase().includes('custom') && displayPrice === 0) {
      const customBasePrice = 129.99;
      displayPrice = customBasePrice;
      console.log(
        `[PACKAGE MANAGEMENT] Custom package with zero price, using base price: ${customBasePrice}`
      );
    }

    let multiCurrency: Record<string, number> | null = null;
    if (pkg.multiCurrencyPrices) {
      try {
        multiCurrency = JSON.parse(pkg.multiCurrencyPrices);
        console.log(
          `[PACKAGE MANAGEMENT] Parsed multiCurrencyPrices:`,
          multiCurrency
        );
      } catch (e) {
        console.error(
          '[PACKAGE MANAGEMENT] Error parsing multiCurrencyPrices:',
          JSON.stringify(e, null, 2)
        );
      }
    }

    if (currency && multiCurrency && multiCurrency[currency]) {
      displayPrice = multiCurrency[currency];
      console.log(
        `[PACKAGE MANAGEMENT] Using price from multiCurrencyPrices for ${currency}: ${displayPrice}`
      );
    } else if (currency !== 'USD') {
      displayPrice = displayPrice * rate;
      console.log(
        `[PACKAGE MANAGEMENT] Converting price using rate (${rate}): ${displayPrice}`
      );
    }

    const result = {
      displayPrice,
      formattedPrice: formatPrice(displayPrice),
    };

    console.log(
      `[PACKAGE MANAGEMENT] Final price for ${pkg.title}: ${result.formattedPrice} (${currency})`
    );
    return result;
  };

  const [lastEnabledPackageId, setLastEnabledPackageId] = useState<
    number | null
  >(null);

  const enableOperationInProgressRef = useRef<boolean>(false);
  const packageBeingProcessedRef = useRef<number | null>(null);

  const handleEnablePackage = useCallback(
    async (packageId: number) => {
      if (
        processingPackageId !== null ||
        lastEnabledPackageId === packageId ||
        enableOperationInProgressRef.current ||
        packageBeingProcessedRef.current === packageId
      ) {
        console.log(
          `[PACKAGE MANAGEMENT] Skipping duplicate enable operation for package ${packageId}`
        );
        return;
      }

      setProcessingPackageId(packageId);
      enableOperationInProgressRef.current = true;
      packageBeingProcessedRef.current = packageId;

      try {
        const selectedPkg = packages.find((pkg) => pkg.id === packageId);
        const isCustomPackage = selectedPkg?.type?.includes('custom') || false;

        console.log(
          `[PACKAGE MANAGEMENT] Enabling package ${packageId}, isCustom: ${isCustomPackage}`
        );

        await enableAdditionalPackage(packageId);
        setLastEnabledPackageId(packageId);

        if (selectedPkg) {
          let normalizedType:
            | 'starter-plus'
            | 'growth-pro'
            | 'enterprise-elite'
            | 'custom-pro'
            | 'premium-plus' = 'starter-plus';
          if (selectedPkg.type) {
            if (selectedPkg.type.includes('custom')) {
              normalizedType = 'custom-pro';
            } else if (selectedPkg.type.includes('starter')) {
              normalizedType = 'starter-plus';
            } else if (selectedPkg.type.includes('growth')) {
              normalizedType = 'growth-pro';
            } else if (selectedPkg.type.includes('enterprise')) {
              normalizedType = 'enterprise-elite';
            } else if (selectedPkg.type.includes('premium')) {
              normalizedType = 'premium-plus';
            }
          }

          const packageForSelection = {
            ...selectedPkg,
            type: normalizedType,
          };

          const selectionDelay = isCustomPackage ? 800 : 200;

          console.log(
            `[PACKAGE MANAGEMENT] Setting up selection with delay: ${selectionDelay}ms`
          );

          setTimeout(() => {
            selectPackageInContext(packageForSelection);
            console.log(
              `[PACKAGE MANAGEMENT] Package ${packageId} selected in context:`,
              packageForSelection.title
            );

            setSavedPackage(selectedPkg);

            const now = new Date();
            setPurchaseDate(now);
            safeLocalStorage.setItem(
              PURCHASE_DATE_KEY,
              JSON.stringify(now.toISOString())
            );

            const nextBilling = new Date(now);
            nextBilling.setDate(nextBilling.getDate() + 30);
            setNextBillingDate(nextBilling);

            if (selectedPkg.testPeriodDays > 0) {
              const newTime = selectedPkg.testPeriodDays * 24 * 60 * 60;
              setRemainingTime(newTime);
              safeLocalStorage.setItem(
                TIMER_STATE_KEY,
                JSON.stringify(newTime)
              );
              safeLocalStorage.setItem(
                TIMER_LAST_UPDATED_KEY,
                Date.now().toString()
              );
              safeLocalStorage.setItem(
                SELECTED_PACKAGE_DATA_KEY,
                JSON.stringify(selectedPkg)
              );
              console.log(
                `[PACKAGE MANAGEMENT] Timer reset to ${formatTime(newTime)} for package: ${selectedPkg.title}`
              );
            }

            const resetDelay = isCustomPackage ? 1000 : 500;
            console.log(
              `[PACKAGE MANAGEMENT] Setting up reset with delay: ${resetDelay}ms`
            );

            setTimeout(() => {
              console.log(
                `[PACKAGE MANAGEMENT] Releasing processing state for package ${packageId}`
              );
              setProcessingPackageId(null);
              enableOperationInProgressRef.current = false;
              packageBeingProcessedRef.current = null;
            }, resetDelay);
          }, selectionDelay);
        } else {
          console.warn(
            `[PACKAGE MANAGEMENT] Package with ID ${packageId} not found in available packages`
          );

          setProcessingPackageId(null);
          enableOperationInProgressRef.current = false;
          packageBeingProcessedRef.current = null;
        }
      } catch (error) {
        console.error('[PACKAGE MANAGEMENT] Error enabling package:', error);

        setProcessingPackageId(null);
        enableOperationInProgressRef.current = false;
        packageBeingProcessedRef.current = null;
      }
    },
    [
      processingPackageId,
      lastEnabledPackageId,
      packages,
      enableAdditionalPackage,
      selectPackageInContext,
      setSavedPackage,
      setPurchaseDate,
      setNextBillingDate,
      setRemainingTime,
      safeLocalStorage,
      formatTime,
    ]
  );

  const disableOperationInProgressRef = useRef<boolean>(false);
  const packageBeingDisabledRef = useRef<number | null>(null);

  const handleDisablePackage = useCallback(
    async (packageId: number) => {
      if (
        processingPackageId !== null ||
        disableOperationInProgressRef.current ||
        packageBeingDisabledRef.current === packageId
      ) {
        console.log(
          `[PACKAGE MANAGEMENT] Skipping duplicate disable operation for package ${packageId}`
        );
        return;
      }

      setProcessingPackageId(packageId);
      disableOperationInProgressRef.current = true;
      packageBeingDisabledRef.current = packageId;

      try {
        console.log(`[PACKAGE MANAGEMENT] Disabling package ${packageId}`);
        await disableAdditionalPackage(packageId);
        console.log(
          `[PACKAGE MANAGEMENT] Package ${packageId} disabled successfully`
        );
      } catch (error) {
        console.error('[PACKAGE MANAGEMENT] Error disabling package:', error);
      } finally {
        setTimeout(() => {
          console.log(
            `[PACKAGE MANAGEMENT] Releasing disable processing state for package ${packageId}`
          );
          setProcessingPackageId(null);
          disableOperationInProgressRef.current = false;
          packageBeingDisabledRef.current = null;
        }, 500);
      }
    },
    [processingPackageId, disableAdditionalPackage]
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <TranslatedText
          i18nKey="settings.packageManagement"
          defaultValue="Package Management"
        />
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: '#f8f8f8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              <TranslatedText
                i18nKey="settings.currentSubscription"
                defaultValue="Current Subscription"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <TranslatedText
                i18nKey="packages.currentActiveSubscription"
                defaultValue="Your current active subscription package"
              />
            </Typography>
          </Box>
          <Chip
            label={
              <TranslatedText i18nKey="packages.active" defaultValue="Active" />
            }
            color="success"
            size="small"
            icon={<CheckCircleIcon />}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#173A79',
                color: 'white',
                fontWeight: 'bold',
                minWidth: '100px',
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              {savedPackage?.title || subscription?.package?.title || 'Starter'}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                Started: {purchaseDate.toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                Next billing: {nextBillingDate.toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {}
          {remainingTime > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                p: 1,
                borderRadius: 1,
              }}
            >
              <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: '20px' }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TranslatedText
                  i18nKey="packages.testPeriod"
                  defaultValue="Test Period:"
                />
                <span
                  style={{
                    color: '#F59E0B',
                    fontWeight: 'bold',
                  }}
                >
                  {formatTime(remainingTime)}
                </span>
                <TranslatedText
                  i18nKey="packages.remaining"
                  defaultValue="remaining"
                />
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <TranslatedText
              i18nKey="packages.availablePackages"
              defaultValue="Available Packages"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <TranslatedText
              i18nKey="packages.upgradeDescription"
              defaultValue="Upgrade your subscription or add additional packages to access more features"
            />
          </Typography>
        </Box>
        <MuiButton
          variant="outlined"
          size="small"
          onClick={() => {
            if (refetchPackages) {
              refetchPackages();
            } else {
              fetch('/api/PricingPackages?refresh=true')
                .then((res) => res.json())
                .then((data) => {
                  if (data && data.data) {
                    setPackages(data.data);
                  }
                })
                .catch((err) => {
                  console.error('Error refreshing packages:', err);
                });
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <TranslatedText
              i18nKey="packages.refreshPackages"
              defaultValue="Refresh Packages"
            />
          )}
        </MuiButton>
      </Box>

      {error && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 2,
            color: '#ef4444',
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      <div className={styles.container}>
        {packages
          .filter((pkg) =>
            [
              'Starter Plus',
              'Growth Pro',
              'Custom Pro',
              'Enterprise Elite',
              'Premium Plus',
            ].includes(pkg.title)
          )
          .map((pkg) => {
            const { formattedPrice } = getPackagePrice(pkg);
            const isCustom = pkg.type?.toLowerCase().includes('custom');
            const isCurrentSubscription =
              pkg.id === subscription?.pricingPackageId;
            const isPurchased =
              isPurchasedPackage(pkg.id) || savedPackage?.id === pkg.id;
            const isDisabled = isCurrentSubscription || isPurchased;
            const IconComponent =
              iconMap[pkg.icon] || iconMap['MUI:DefaultIcon'];
            const isProcessing = processingPackageId === pkg.id;

            return (
              <Card
                key={pkg.id}
                className={`${styles.card} ${isCustom ? styles.custom : ''} ${isDisabled ? styles.disabled : ''}`}
              >
                {isCustom && (
                  <div className={styles.customBadge}>
                    <TranslatedText
                      i18nKey="packages.custom"
                      defaultValue="Custom"
                    />
                  </div>
                )}
                <CardHeader className={styles.header}>
                  <div className={styles.iconWrapper}>
                    {IconComponent &&
                      React.createElement(IconComponent, {
                        className: styles.icon,
                      })}
                  </div>
                  <h2 className={styles.title}>{pkg.title}</h2>
                </CardHeader>

                <CardContent className={styles.content}>
                  <ul>
                    {pkg.description
                      .split(';')
                      .map((desc: string, index: number) => (
                        <li key={index}>{desc.trim()}</li>
                      ))}
                  </ul>
                </CardContent>

                <div className={styles.priceSection}>
                  {pkg.testPeriodDays > 0 && (
                    <div className={styles.trial}>
                      <TranslatedText
                        i18nKey="packages.freeTrial"
                        values={{ days: pkg.testPeriodDays }}
                        defaultValue={`${pkg.testPeriodDays} days free trial`}
                      />
                    </div>
                  )}
                  <div className={settingsStyles.settingsPrice}>
                    {isCustom ? (
                      <div
                        className={settingsStyles.settingsCustomPriceContainer}
                      >
                        <span
                          className={settingsStyles.settingsCustomPriceLabel}
                        >
                          <TranslatedText
                            i18nKey="packages.startingAt"
                            defaultValue="Starting at"
                          />
                        </span>
                        <div
                          className={settingsStyles.settingsCustomPriceWrapper}
                        >
                          <span
                            className={settingsStyles.settingsCustomCurrency}
                          >
                            {currencySymbol}
                          </span>
                          <span
                            className={settingsStyles.settingsCustomPriceValue}
                          >
                            {formattedPrice}
                          </span>
                          <span className={settingsStyles.settingsCustomPeriod}>
                            <TranslatedText
                              i18nKey="packages.perMonth"
                              defaultValue="/month"
                            />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className={settingsStyles.settingsCurrency}>
                          {currencySymbol}
                        </span>
                        <span className={settingsStyles.settingsPriceValue}>
                          {formattedPrice}
                        </span>
                        <span className={settingsStyles.settingsPeriod}>
                          <TranslatedText
                            i18nKey="packages.perMonth"
                            defaultValue="/month"
                          />
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <CardFooter className={styles.footer}>
                  {isCurrentSubscription ? (
                    <Button
                      className={styles.button}
                      disabled
                      sx={{ backgroundColor: '#4CAF50' }}
                    >
                      <TranslatedText
                        i18nKey="settings.currentSubscription"
                        defaultValue="Current Subscription"
                      />
                    </Button>
                  ) : isPurchased ? (
                    <Button
                      className={styles.button}
                      disabled
                      sx={{ backgroundColor: '#4CAF50' }}
                    >
                      <TranslatedText
                        i18nKey="packages.purchasedPlan"
                        defaultValue="Purchased Plan"
                      />
                    </Button>
                  ) : subscription?.additionalPackages?.includes(pkg.id) ? (
                    <Button
                      className={styles.button}
                      onClick={() => handleDisablePackage(pkg.id)}
                      sx={{ backgroundColor: '#ef4444' }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <TranslatedText
                          i18nKey="packages.disable"
                          defaultValue="Disable"
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      className={styles.button}
                      onClick={() => handleEnablePackage(pkg.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : pkg.id > (subscription?.pricingPackageId ?? 0) ? (
                        <TranslatedText
                          i18nKey="packages.upgrade"
                          defaultValue="Upgrade"
                        />
                      ) : (
                        <TranslatedText
                          i18nKey="packages.enable"
                          defaultValue="Enable"
                        />
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </Box>
  );
};

export default PackageManagementContent;
