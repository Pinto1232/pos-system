export interface Sale {
    id: string;
    progress: number;
    paymentMethod: string;
    items: {
        count: number;
        name: string;
        quantity: number;
    };
    cashier: string;
    dateTime: string;
}

export interface SaleTableProps {
    sales: Sale[];
    onViewDetails: (id: string) => void;
    onViewReceipt: (id: string) => void;
    onDelete: (id: string) => void;
    className?: string;
}

export interface SaleTableContainerProps {
    className?: string;
} 