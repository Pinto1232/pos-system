'use client';

import React from 'react';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import { ImageCardProps } from './types';

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, title, description, onClick, className }) => {
  return (
    <Card
      className={className}
      onClick={onClick}
      sx={{
        maxWidth: 345,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: onClick ? 'scale(1.02)' : 'none',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        sx={{
          objectFit: 'cover',
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
