'use client';

import React from 'react';
import { useTranslationContext } from '@/i18n';
import Testimonial from './Testimonial';

const TestimonialContainer: React.FC = () => {
  const { t } = useTranslationContext();

  const aboutUsData = {
    videoSrc: '/testimonial-video.mp4',
    clientName: 'Pinto Manuel',
    clientPosition: 'CEO',
    clientCompany: 'Pisval Tech',
    testimonialText: `${t('about.intro')} ${t('about.mission')}`,
  };

  return (
    <Testimonial
      videoSrc={aboutUsData.videoSrc}
      clientName={aboutUsData.clientName}
      clientPosition={aboutUsData.clientPosition}
      clientCompany={aboutUsData.clientCompany}
      testimonialText={aboutUsData.testimonialText}
      sectionTitle={t('about.title')}
    />
  );
};

export default TestimonialContainer;
