/**
 * Utility functions for handling product colors
 */

/**
 * Get background and text colors for a product color
 * @param color The product color name
 * @returns Object with background and text colors
 */
export const getColorStyles = (
  color: string
): { bg: string; text: string } => {
  const colorMap: Record<
    string,
    { bg: string; text: string }
  > = {
    // Basic colors
    Black: { bg: '#333333', text: '#ffffff' },
    White: { bg: '#ffffff', text: '#333333' },
    Red: { bg: '#f44336', text: '#ffffff' },
    Blue: { bg: '#2196f3', text: '#ffffff' },
    Green: { bg: '#4caf50', text: '#ffffff' },
    Yellow: { bg: '#ffeb3b', text: '#333333' },
    Purple: { bg: '#9c27b0', text: '#ffffff' },
    Orange: { bg: '#ff9800', text: '#333333' },
    Pink: { bg: '#e91e63', text: '#ffffff' },
    Gray: { bg: '#9e9e9e', text: '#ffffff' },
    Brown: { bg: '#795548', text: '#ffffff' },

    // Special colors
    Silver: { bg: '#c0c0c0', text: '#333333' },
    Gold: { bg: '#ffd700', text: '#333333' },
    'Space Gray': {
      bg: '#2f4f4f',
      text: '#ffffff',
    },
    Navy: { bg: '#000080', text: '#ffffff' },
    Teal: { bg: '#008080', text: '#ffffff' },
    Maroon: { bg: '#800000', text: '#ffffff' },
    Olive: { bg: '#808000', text: '#ffffff' },
    Cyan: { bg: '#00ffff', text: '#333333' },
    Magenta: { bg: '#ff00ff', text: '#ffffff' },
    Lime: { bg: '#00ff00', text: '#333333' },
  };

  // Return the color from the map or a default color
  return (
    colorMap[color] || {
      bg: '#f8fafc',
      text: '#64748b',
    }
  );
};
