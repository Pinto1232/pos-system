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
    Avatar,
    Switch, // Add this import
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FiUpload } from "react-icons/fi";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"; // Add this import

interface Product {
    barcode: string;
    no: string;
    name: string;
    stock: string;
    price: string;
    discount: string;
    avatar: string; // Added avatar property
}

interface ProductTableProps {
    products: Product[];
    onDiscountToggle: (index: number, newValue: string) => void; // Add callback for toggling discount
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

const ProductTable: React.FC<ProductTableProps> = ({ products, onDiscountToggle }) => {
    return (
        <Box p={3} width="100%">
            {/* Search & Actions */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Paper elevation={0} component="form" sx={{ display: "flex", alignItems: "center", flex: 1, mr: 1, color: "#1E3A8A" }}>
                    <InputBase sx={{ ml: 1, flex: 1, color: "#1E3A8A", fontSize: 14 }} placeholder="Search..." />
                    <IconButton type="button">
                        <SearchIcon sx={{ color: "#1E3A8A" }} />
                    </IconButton>
                </Paper>

                <Button variant="outlined" sx={{ flex: 1, color: "#1E3A8A", border: '1px solid #1E3A8A', fontWeight: "bold" }}>Deduction Amount</Button>
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ flex: 1, color: "#1E3A8A", border: '1px solid #1E3A8A', fontWeight: "bold" }}>Total Sum</Button>
                <Button variant="contained" sx={{ backgroundColor: "#1F2937", flex: 1 }} startIcon={<AddIcon />}>Deduction calculation</Button>
            </Box>

            {/* Export */}
            <Box display="flex" justifyContent="space-between" alignItems='center' justifyItems='center' mb={2} sx={{ bgcolor: '#ffff', p: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#1E3A8A" }}>Products</Typography>
                </Box>
                <Button startIcon={<FiUpload />} sx={{ textTransform: "none", color: "#1E3A8A", fontWeight: "bold" }}>
                    Export Product
                </Button>
            </Box>

            {/* Table */}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
                        <TableRow>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Bar code</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>No</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Product name</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Stock</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Sale Price</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Discount</TableCell>
                            <TableCell sx={{ color: "#1E3A8A", fontWeight: "bold", fontSize: 16 }}>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "#f1f5f952",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>
                                    <Avatar src={item.avatar} alt={item.name}>{item.name.charAt(0)}</Avatar>
                                </TableCell>
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>{item.barcode}</TableCell>
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>{item.no}</TableCell>
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>{item.name}</TableCell>
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>{getStockChip(item.stock)}</TableCell>
                                <TableCell sx={{ "&:hover": { color: "#1E3A8A" } }}>{item.price}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Switch
                                            checked={item.discount === "Yes"}
                                            onChange={() => onDiscountToggle(index, item.discount === "Yes" ? "No" : "Yes")}
                                            color="primary"
                                        />
                                        <Typography variant="body2" sx={{ color: item.discount === "Yes" ? "#3EB15D" : "#F44336" }}>
                                            {item.discount}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary">
                                        <EditIcon sx={{ color: "#1E3A8A" }} />
                                    </IconButton>
                                    <IconButton color="error">
                                        <DeleteIcon sx={{ color: "#F44336" }} />
                                    </IconButton>
                                </TableCell>
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
