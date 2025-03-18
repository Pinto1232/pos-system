import React from "react";
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FiUpload } from "react-icons/fi";

interface Product {
    barcode: string;
    no: string;
    name: string;
    stock: string;
    price: string;
    discount: string;
}

interface ProductTableProps {
    products: Product[];
}

const getStockChip = (status: string) => {
    switch (status) {
        case "In Stock":
            return <Chip label="In Stock" sx={{ backgroundColor: "#3EB15D", color: "#fff" }} />;
        case "Sold out":
            return <Chip label="Sold out" sx={{ backgroundColor: "#F44336", color: "#fff" }} />;
        case "Pending":
            return <Chip label="Pending" sx={{ backgroundColor: "#9E9E9E", color: "#fff" }} />;
        default:
            return <Chip label={status} />;
    }
};

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
    return (
        <Box p={3} width="100%" >
            {/* Search & Actions */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Paper component="form" sx={{ display: "flex", alignItems: "center", flex: 1, mr: 1 }}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
                    <IconButton type="button">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <Button variant="outlined" sx={{ flex: 1 }}>Deduction Amount</Button>
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ flex: 1 }}>Total Sum</Button>
                <Button variant="contained" sx={{ backgroundColor: "#1F2937", flex: 1 }} startIcon={<AddIcon />}>Deduction calculation</Button>
            </Box>

            {/* Export */}
            <Box display="flex" justifyContent="space-between" alignItems='center' justifyItems='center' mb={2} sx={{ bgcolor: '#ffff', p: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#1E3A8A" }}>Products</Typography>
                </Box>
                <Button startIcon={<FiUpload  />} sx={{ textTransform: "none", color: "#1E3A8A", fontWeight: "bold" }}>
                    Export Product
                </Button>
            </Box>

            {/* Table */}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                        <TableRow>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell>Bar code</TableCell>
                            <TableCell>No</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Sale Price</TableCell>
                            <TableCell>Discount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>{item.barcode}</TableCell>
                                <TableCell>{item.no}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{getStockChip(item.stock)}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.discount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="body2">1 to 16</Typography>
                <IconButton sx={{ backgroundColor: "#1E3A8A", color: "#fff" }}>
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ProductTable;
