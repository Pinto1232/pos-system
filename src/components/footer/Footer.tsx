'use client';

import React, { memo, Suspense, useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import { Container, Typography, Box, Link, TextField } from '@mui/material';
import SocialIcons from '@/components/ui/socialIcons/SocialIcons';
import { Button } from '../ui/button/Button';
import { useCustomization } from '@/contexts/CustomizationContext';
import { TranslatedText, useTranslationContext } from '@/i18n';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';

const Footer: React.FC = memo(() => {
  const { navbarColor } = useCustomization();
  const { t } = useTranslationContext();

  const footerBoxRef = useRef<HTMLDivElement>(null);
  const footerElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleCustomizationUpdate = (data: { navbarColor?: string }) => {
      if (footerBoxRef.current && data.navbarColor) {
        footerBoxRef.current.style.backgroundColor = data.navbarColor;
      }

      if (footerElementRef.current && data.navbarColor) {
        footerElementRef.current.style.backgroundColor = data.navbarColor;
      }
    };

    eventBus.on(UI_EVENTS.CUSTOMIZATION_UPDATED, handleCustomizationUpdate);

    handleCustomizationUpdate({ navbarColor });

    return () => {
      eventBus.off(UI_EVENTS.CUSTOMIZATION_UPDATED, handleCustomizationUpdate);
    };
  }, [navbarColor]);

  useEffect(() => {
    if (footerBoxRef.current) {
      footerBoxRef.current.style.backgroundColor = navbarColor;
    }
    if (footerElementRef.current) {
      footerElementRef.current.style.backgroundColor = navbarColor;
    }
  }, [navbarColor]);

  return (
    <Box
      ref={footerBoxRef}
      className={styles.footerRoot}
      sx={{
        backgroundColor: navbarColor,
        display: 'block',
        width: '100%',
        margin: 0,
        padding: 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      <footer
        ref={footerElementRef}
        className={styles.footer}
        style={{
          backgroundColor: navbarColor,
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box
            className={styles.subscription}
            sx={{
              gap: {
                xs: '16px',
                sm: '20px',
                md: '24px',
              },
              marginBottom: {
                xs: '30px',
                sm: '40px',
                md: '60px',
              },
              padding: {
                xs: '0 15px',
                sm: '0 20px',
              },
            }}
          >
            <Typography
              variant="h5"
              className={styles.heading}
              sx={{
                fontSize: {
                  xs: '24px',
                  sm: '28px',
                  md: '32px',
                },
              }}
            >
              <TranslatedText
                i18nKey="subscription.title"
                defaultValue="SUBSCRIBE NOW"
              />
              <br />
              <TranslatedText
                i18nKey="subscription.subtitle"
                defaultValue="FOR UPDATES AND EXCLUSIVE OFFERS!"
              />
            </Typography>
            <Box
              className={styles.inputBox}
              sx={{
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                gap: { xs: '8px', sm: '0' },
              }}
            >
              <TextField
                variant="outlined"
                placeholder={t('subscription.placeholder', {
                  defaultValue: 'Enter your email',
                })}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    height: {
                      xs: '44px',
                      sm: '48px',
                    },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#000000',
                    padding: {
                      xs: '12px 16px',
                      sm: '14px 20px',
                    },
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
              <Button className={styles.sendButton}>
                <TranslatedText
                  i18nKey="subscription.button"
                  defaultValue="SUBSCRIBE"
                />
              </Button>
            </Box>
          </Box>

          <Box className={styles.divider} />

          <Box
            className={styles.footerContent}
            sx={{
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: {
                xs: '30px',
                sm: '30px',
                md: '40px',
              },
              padding: {
                xs: '20px 15px 10px',
                sm: '20px 20px 10px',
                md: '30px 20px 20px',
              },
              justifyContent: 'center',
              textAlign: { xs: 'center', sm: 'start' },
            }}
          >
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'start' },
              }}
            >
              <Typography
                variant="h6"
                className={styles.sectionTitle}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.company"
                  defaultValue="Company"
                />
              </Typography>
              <ul
                className={styles.list}
                style={{
                  textAlign: 'inherit',
                }}
              >
                <li>
                  <Link href="#" className={styles.link}>
                    <TranslatedText i18nKey="footer.home" defaultValue="Home" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    <TranslatedText
                      i18nKey="footer.services"
                      defaultValue="Our Services"
                    />
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    <TranslatedText
                      i18nKey="footer.about"
                      defaultValue="About Us"
                    />
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    <TranslatedText
                      i18nKey="footer.contact"
                      defaultValue="Contact"
                    />
                  </Link>
                </li>
              </ul>
            </Box>

            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'start' },
              }}
            >
              <Typography
                variant="h6"
                className={styles.sectionTitle}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.contact"
                  defaultValue="Contact"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.tel1"
                  defaultValue="Tel: +1 5263 2540 981"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.tel2"
                  defaultValue="Tel: +1 5263 5720 450"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.email1"
                  defaultValue="Email: info@info.com"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.email2"
                  defaultValue="Email: career@career.com"
                />
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'start' },
              }}
            >
              <Typography
                variant="h6"
                className={styles.sectionTitle}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.office"
                  defaultValue="Cape Town Office"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.address1"
                  defaultValue="361 Avisco Green St,"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.address2"
                  defaultValue="Lovasa Avenue, Cape Town,"
                />
              </Typography>
              <Typography
                className={styles.text}
                sx={{
                  textAlign: { xs: 'center', sm: 'start' },
                }}
              >
                <TranslatedText
                  i18nKey="footer.address3"
                  defaultValue="90251, US"
                />
              </Typography>
            </Box>

            <Box
              className={styles.socialContainer}
              sx={{
                alignItems: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                className={styles.sectionTitle}
                sx={{
                  textAlign: 'center',
                }}
              >
                <TranslatedText
                  i18nKey="footer.followUs"
                  defaultValue="Follow Us On"
                />
              </Typography>
              <SocialIcons />
            </Box>
          </Box>

          <Box
            className={styles.copyrightContainer}
            sx={{
              padding: {
                xs: '0 15px 15px',
                sm: '0 20px 10px',
              },
              marginTop: {
                xs: '15px',
                sm: '20px',
              },
              gap: { xs: '10px', sm: '8px' },
            }}
          >
            <Link
              href="#"
              className={styles.privacy}
              sx={{
                fontSize: {
                  xs: '13px',
                  sm: '14px',
                },
              }}
            >
              <TranslatedText
                i18nKey="footer.privacy"
                defaultValue="Privacy Policy"
              />
            </Link>
            <Typography
              variant="body2"
              className={styles.copyright}
              sx={{
                fontSize: {
                  xs: '11px',
                  sm: '12px',
                },
                padding: {
                  xs: '10px 15px',
                  sm: '10px',
                },
                lineHeight: 1.4,
              }}
            >
              <TranslatedText
                i18nKey="footer.copyright"
                values={{ year: new Date().getFullYear() }}
                defaultValue={`© ${new Date().getFullYear()} Pisval Tech. All rights reserved.`}
              />
            </Typography>
          </Box>
        </Container>
      </footer>
    </Box>
  );
});

Footer.displayName = 'Footer';

const LazyFooter = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Footer />
  </Suspense>
);

export default LazyFooter;
