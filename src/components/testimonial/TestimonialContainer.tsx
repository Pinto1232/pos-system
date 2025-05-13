'use client';

import React from 'react';
import Testimonial from './Testimonial';

const TestimonialContainer: React.FC = () => {
  // About us data
  const aboutUsData = {
    videoSrc: '/testimonial-video.mp4',
    clientName: 'Pinto Manuel',
    clientPosition: 'CEO',
    clientCompany: 'Pisval Tech',
    testimonialText:
      "At Pisval Tech, we are dedicated to revolutionizing the retail industry through innovative point of sale solutions. Our journey began with a simple vision: to create a POS system that combines powerful functionality with intuitive design. Today, we serve businesses of all sizes, helping them streamline operations, enhance customer experiences, and drive growth. Our team of passionate experts is committed to continuous improvement and exceptional service. We believe that technology should empower businesses, not complicate them. That's why we've built a solution that adapts to your unique needs and grows with your business.",
  };

  return (
    <Testimonial
      videoSrc={aboutUsData.videoSrc}
      clientName={aboutUsData.clientName}
      clientPosition={aboutUsData.clientPosition}
      clientCompany={aboutUsData.clientCompany}
      testimonialText={
        aboutUsData.testimonialText
      }
      sectionTitle="About Us"
    />
  );
};

export default TestimonialContainer;
