import React from 'react';
import Jumbotron from './Jumbotron';
import { TranslatedText } from '@/i18n';

interface JumbotronContainerProps {
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  backgroundImage?: string;
  overlayColor?: string;
}

const JumbotronContainer: React.FC<JumbotronContainerProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor,
}) => {
  const finalHeading = heading || (
    <TranslatedText
      i18nKey="app.fullName"
      defaultValue="Pisval Tech Point of Sale System"
    />
  );

  const finalSubheading = subheading || (
    <TranslatedText
      i18nKey="app.marketingTagline"
      defaultValue="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
    />
  );
  const finalBackground = backgroundImage || '/pos_banner.jpg';
  const finalOverlay = overlayColor || 'rgba(0, 0, 0, 0.7)';

  return (
    <Jumbotron
      heading={finalHeading}
      subheading={finalSubheading}
      backgroundImage={finalBackground}
      overlayColor={finalOverlay}
    />
  );
};

export default JumbotronContainer;
