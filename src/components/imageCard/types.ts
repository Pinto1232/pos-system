export interface ImageCardProps {
  imageUrl: string;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export interface ImageCardContainerProps extends Omit<ImageCardProps, 'className'> {
  onCardClick?: () => void;
} 