"use client";

import React, { memo } from "react";
import styles from "./Footer.module.css";
import { Container, Typography, Box, Link, Grid, TextField, Button } from "@mui/material";
import SocialIcons from "@/components/ui/socialIcons/SocialIcons";

const Footer: React.FC = memo(() => {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        {/* Top Section - Subscription */}
        <Box className={styles.subscription}>
          <Typography variant="h5" className={styles.heading}>
            SUBSCRIBE NOW TO
            <br />
            FOR UPDATES AND EXCLUSIVE OFFERS!
          </Typography>
          <Box className={styles.inputBox}>
            <TextField 
              variant="outlined" 
              placeholder="Your email" 
              className={styles.input}
              InputProps={{ sx: { borderRadius: '4px', height: '40px' } }}
            />
            <Button variant="contained" className={styles.sendButton}>
              SUBSCRIBE
            </Button>
          </Box>
        </Box>

        {/* Divider */}
        <Box className={styles.divider} />

        {/* Main Footer Content */}
        <Grid container spacing={4} className={styles.footerContent}>
          {/* Company Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>Company</Typography>
            <ul className={styles.list}>
              <li><Link href="#" className={styles.link}>Home</Link></li>
              <li><Link href="#" className={styles.link}>Our Services</Link></li>
              <li><Link href="#" className={styles.link}>About Us</Link></li>
              <li><Link href="#" className={styles.link}>Contact</Link></li>
            </ul>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>Contact</Typography>
            <Typography className={styles.text}>Tel: +1 5263 2540 981</Typography>
            <Typography className={styles.text}>Tel: +1 5263 5720 450</Typography>
            <Typography className={styles.text}>Email: info@info.com</Typography>
            <Typography className={styles.text}>Email: career@career.com</Typography>
          </Grid>

          {/* Location Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className={styles.sectionTitle}>New York</Typography>
            <Typography className={styles.text}>361 Avisco Green St,</Typography>
            <Typography className={styles.text}>Lovasa Avenue, Los Angeles</Typography>
            <Typography className={styles.text}>90251, US</Typography>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={3} className={styles.socialContainer}>
            <Typography variant="h6" className={styles.sectionTitle}>Follow Us On</Typography>
            <SocialIcons />
            <Link href="#" className={styles.privacy}>Privacy Policy</Link>
          </Grid>
        </Grid>

        {/* Bottom Text */}
        <Typography variant="body2" className={styles.copyright}>
          © {new Date().getFullYear()} Posval Tech. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;