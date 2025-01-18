export interface PricingPackageProps {
  id: number;
  title: string;
  description: string; // Raw description from API
  descriptionList: string[]; // Parsed list of descriptions
  extraDescription: string;
  icon: string;
  price: number;
  testPeriodDays: number;
  onClick: () => void;
}
