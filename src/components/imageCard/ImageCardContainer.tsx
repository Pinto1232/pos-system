'use client';

import React from 'react';
import ImageCard from './ImageCard';
import { ImageCardContainerProps } from './types';

const ImageCardContainer: React.FC<ImageCardContainerProps> = ({
  imageUrl,
  title,
  description,
  onCardClick,
}) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <ImageCard
      imageUrl={imageUrl}
      title={title}
      description={description}
      onClick={handleClick}
    />
  );
};

export default ImageCardContainer;
