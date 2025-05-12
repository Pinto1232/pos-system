'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import styles from './Testimonial.module.css';

interface TestimonialProps {
  videoSrc: string;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  testimonialText: string;
  sectionTitle?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  videoSrc,
  clientName,
  clientPosition,
  clientCompany,
  testimonialText,
  sectionTitle = 'What Our Clients Say',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] =
    useState(false);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box className={styles.testimonialContainer}>
      <Box className={styles.testimonialWrapper}>
        <Box className={styles.videoSection}>
          <Box
            className={`${styles.videoDecoration} ${styles.videoDecoration1}`}
          ></Box>
          <Box
            className={`${styles.videoDecoration} ${styles.videoDecoration2}`}
          ></Box>
          <Box
            className={styles.videoWrapper}
            onClick={handleVideoPlay}
          >
            {!isPlaying && (
              <Box
                className={styles.playButton}
              ></Box>
            )}
            <video
              ref={videoRef}
              className={styles.testimonialVideo}
              poster="/testimonial-poster.jpg"
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
            >
              <source
                src={videoSrc}
                type="video/mp4"
              />
              Your browser does not support the
              video tag.
            </video>
          </Box>
        </Box>

        <Box className={styles.textSection}>
          <Paper
            elevation={0}
            className={styles.testimonialCard}
            sx={{
              borderRadius: 0,
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <Typography
              variant="h5"
              className={
                styles.testimonialHeading
              }
            >
              {sectionTitle}
            </Typography>

            <Typography
              variant="body1"
              className={styles.testimonialQuote}
            >
              {testimonialText
                .split('. ')
                .map((sentence, index, array) => (
                  <React.Fragment key={index}>
                    {sentence}
                    {index < array.length - 1
                      ? '. '
                      : ''}
                    {(index + 1) % 2 === 0 &&
                      index !==
                        array.length - 1 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                  </React.Fragment>
                ))}
            </Typography>

            <Box className={styles.clientInfo}>
              <Typography
                variant="h6"
                className={styles.clientName}
              >
                {clientName}
              </Typography>
              <Typography
                variant="body2"
                className={styles.clientPosition}
              >
                {clientPosition}
                <span
                  className={styles.clientCompany}
                >
                  {clientCompany}
                </span>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonial;
