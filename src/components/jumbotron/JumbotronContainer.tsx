import React from 'react';
import Jumbotron from './Jumbotron';

interface JumbotronContainerProps {
  heading?: string;
  subheading?: string;
  backgroundImage?: string;
  overlayColor?: string;
}

const JumbotronContainer: React.FC<
  JumbotronContainerProps
> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor,
}) => {
  const finalHeading =
    heading || 'Empower Your Business';
  const finalSubheading =
    subheading ||
    'Streamline Sales, Manage Inventory, and Grow with Confidence!';
  const finalBackground =
    backgroundImage || '/pos_banner.jpg';
  const finalOverlay =
    overlayColor || 'rgba(0, 0, 0, 0.7)';

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
