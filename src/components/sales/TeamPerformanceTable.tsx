import React from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { TeamMember } from '@/components/sales/types';
import TeamMemberRow from './TeamMemberRow';

interface TeamPerformanceTableProps {
    teamPerformance: TeamMember[];
    formatCurrency: (value: number) => string;
    onViewDetails: (memberId: string) => void;
}

const TeamPerformanceTable: React.FC<TeamPerformanceTableProps> = ({ 
    teamPerformance, 
    formatCurrency, 
    onViewDetails 
}) => (
    <TableContainer component={Paper} variant="outlined">
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Sales</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Leads</TableCell>
                    <TableCell>KPI</TableCell>
                    <TableCell>W/L</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {teamPerformance.slice(0, 3).map((member, index) => (
                    <TeamMemberRow
                        key={index}
                        member={member}
                        formatCurrency={formatCurrency}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default TeamPerformanceTable;