export type FullOverviewCardVariant = "overview" | "bankCard" | "analytics" | "notification";

export interface FullOverviewCardProps {
  variant: FullOverviewCardVariant;
  topLeftLabel?: string;
  topRightIcon?: string;
  title: string;
  subTitle?: string;
  price?: string;
  ctaText?: string;
  details?: string[];
  imageUrl?: string;
  bankName?: string;
  bankType?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpire?: string;
  totalBalance?: string;
  cost?: string;
  receipts?: string;
  BankCardRowDetail?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  chartData?: {
    labels: string[];
    values: number[];
  };
  notificationType?: "success" | "warning" | "error" | "info";
  notificationTime?: string;
  notificationIcon?: string;
  onClick?: () => void;
  isActive?: boolean;
  tags?: string[];
  status?: "active" | "inactive" | "pending";
  viewMode?: 'grid' | 'list';
}
