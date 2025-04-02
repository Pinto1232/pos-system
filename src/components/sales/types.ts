export interface TeamMember {
    name: string;
    amount: number;
    percentage: number;
    avatar?: string;
}

export interface SalesMetrics {
    revenue: number;
    previousRevenue: number;
    percentageChange: number;
    changeAmount: number;
    topSales: {
        count: number;
        name: string;
    };
    bestDeal: {
        amount: number;
        company: string;
        starred?: boolean;
    };
    deals: {
        count: number;
        change: number;
    };
    value: {
        amount: number;
        unit: string;
    };
    winRate: {
        percentage: number;
        change: number;
    };
    teamMembers: TeamMember[];
    timeframe: {
        start: string;
        end: string;
    };
}

export interface SalesProps {
    metrics: SalesMetrics;
    timeframe: string;
    onTimeframeChange?: (timeframe: string) => void;
    className?: string;
}

export interface SalesContainerProps {
    className?: string;
    imageUrl?: string;
    title?: string;
    description?: string;
    timeframe?: string;
    onTimeframeChange?: (timeframe: string) => void;
} 