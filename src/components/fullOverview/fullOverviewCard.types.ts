export type FullOverviewCardVariant = "overview" | "bankCard";

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
}
