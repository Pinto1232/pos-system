'use client';

import React from 'react';
import Image from 'next/image';

interface FlagIconProps {
  countryCode: string;
  size?: number;
  className?: string;
}

const flagAspectRatios: Record<string, number> = {
  za: 512 / 356.18,
  ao: 512 / 356.18,
  es: 750 / 500,
  fr: 900 / 600,
};

const countryToFlagCode = {
  za: 'za',
  ao: 'ao',
  es: 'es',
  fr: 'fr',
};

const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  size = 24,
  className = '',
}) => {
  const code =
    countryToFlagCode[
      countryCode.toLowerCase() as keyof typeof countryToFlagCode
    ] || countryCode.toLowerCase();

  // Get the aspect ratio for this flag (default to 3:2 if not specified)
  const aspectRatio = flagAspectRatios[code] || 1.5;

  // Calculate height based on aspect ratio
  const height = Math.round(size / aspectRatio);

  return (
    <div
      style={{
        width: size,
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        padding: 1,
        borderRadius: 0,
      }}
      className={className}
    >
      <Image
        src={`/flags/${code}.svg`}
        alt={`${countryCode} flag`}
        width={size}
        height={height}
        style={{
          objectFit: 'contain',
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: 0,
        }}
        priority
      />
    </div>
  );
};

export default FlagIcon;
