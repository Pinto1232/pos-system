import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiClient, useUpdateCustomization } from "@/api/axiosClient";
import Image from "next/image";
import { MdRestore } from "react-icons/md";
import { SketchPicker, ColorResult } from "react-color";
import { FaPaintBrush } from "react-icons/fa";

export interface UserCustomization {
    id: number;
    userId: string;
    sidebarColor: string;
    logoUrl: string;
    navbarColor: string;
}

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    onCustomizationUpdated: (updated: UserCustomization) => void;
}

const DEFAULT_SIDEBAR_COLOR = "#173A79";
const DEFAULT_LOGO_URL = "/Pisval_Logo.jpg";
const DEFAULT_NAVBAR_COLOR = "#000000";

const fetchCustomization = async (userId: string): Promise<UserCustomization> => {
    const response = await apiClient.get(`/UserCustomization/${userId}`);
    return response.data;
};

type SettingsSection = {
    id: string;
    label: string;
    content: React.ReactNode;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
    open,
    onClose,
    userId,
    onCustomizationUpdated,
}) => {
    const { data, isLoading, error } = useQuery<UserCustomization, Error>({
        queryKey: ["userCustomization", userId],
        queryFn: () => fetchCustomization(userId),
        enabled: open,
    });

    // Local state for form fields.
    const [sidebarColor, setSidebarColor] = useState("");
    const [navbarColor, setNavbarColor] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [showSidebarColorPicker, setShowSidebarColorPicker] = useState(false);
    const [showNavbarColorPicker, setShowNavbarColorPicker] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("general");

    useEffect(() => {
        if (data) {
            setSidebarColor(data.sidebarColor);
            setNavbarColor(data.navbarColor);
            setLogoPreview(data.logoUrl);
        } else {
            // If no data, set defaults.
            setSidebarColor(DEFAULT_SIDEBAR_COLOR);
            setNavbarColor(DEFAULT_NAVBAR_COLOR);
            setLogoPreview(DEFAULT_LOGO_URL);
        }
    }, [data, open]);

    // Handle file input change for logo.
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
            // In production, upload the file and set the returned URL.
        }
    };

    // Use update customization mutation.
    const updateCustomizationMutation = useUpdateCustomization();

    const handleSave = () => {
        updateCustomizationMutation.mutate(
            {
                userId,
                sidebarColor,
                navbarColor,
                logoUrl: logoPreview,
            },
            {
                onSuccess: (updatedData) => {
                    onCustomizationUpdated(updatedData as UserCustomization);
                    onClose();
                },
            }
        );
    };

    // Reset form fields to default values.
    const handleReset = () => {
        setSidebarColor(DEFAULT_SIDEBAR_COLOR);
        setNavbarColor(DEFAULT_NAVBAR_COLOR);
        setLogoPreview(DEFAULT_LOGO_URL);
    };

    const settingsSections: SettingsSection[] = [
        {
            id: "general",
            label: "General Settings",
            content: (
                <Box sx={{ p: 3 }}>
                    {isLoading && <Typography>Loading customization...</Typography>}
                    {error && <Typography color="error">{error.message}</Typography>}
                    {data && (
                        <>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                {logoPreview && (
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                        <Image
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            width={80}
                                            height={80}
                                            style={{ borderRadius: "50%", border: "2px solid #ccc" }}
                                            unoptimized
                                        />
                                    </Box>
                                )}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 4,
                                        padding: "8px 16px",
                                        fontWeight: "bold",
                                        color: "primary.main",
                                        borderColor: "primary.main",
                                        "&:hover": { backgroundColor: "primary.light", borderColor: "primary.main" },
                                    }}
                                >
                                    Upload Logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoFileChange}
                                        hidden
                                    />
                                </Button>
                            </Box>
                            <TextField
                                label="Sidebar Color"
                                value={sidebarColor}
                                onChange={(e) => setSidebarColor(e.target.value)}
                                margin="normal"
                                fullWidth
                                sx={{ "& .MuiInputBase-root": { borderRadius: 4 } }}
                                InputProps={{
                                    endAdornment: (
                                        <FaPaintBrush
                                            style={{
                                                color: sidebarColor,
                                                cursor: "pointer",
                                                fontSize: "1.5rem",
                                                marginLeft: "8px",
                                            }}
                                            onClick={() => setShowSidebarColorPicker((prev) => !prev)}
                                        />
                                    ),
                                }}
                            />
                            {showSidebarColorPicker && (
                                <Box sx={{ position: "absolute", zIndex: 2 }}>
                                    <SketchPicker
                                        color={sidebarColor}
                                        onChange={(color: ColorResult) => setSidebarColor(color.hex)}
                                    />
                                </Box>
                            )}
                            <TextField
                                label="Navbar Color"
                                value={navbarColor}
                                onChange={(e) => setNavbarColor(e.target.value)}
                                margin="normal"
                                fullWidth
                                sx={{ "& .MuiInputBase-root": { borderRadius: 4 } }}
                                InputProps={{
                                    endAdornment: (
                                        <FaPaintBrush
                                            style={{
                                                color: navbarColor,
                                                cursor: "pointer",
                                                fontSize: "1.5rem",
                                                marginLeft: "8px",
                                            }}
                                            onClick={() => setShowNavbarColorPicker((prev) => !prev)}
                                        />
                                    ),
                                }}
                            />
                            {showNavbarColorPicker && (
                                <Box sx={{ position: "absolute", zIndex: 2 }}>
                                    <SketchPicker
                                        color={navbarColor}
                                        onChange={(color: ColorResult) => setNavbarColor(color.hex)}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            ),
        },
        {
            id: "business",
            label: "Business Information",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Business Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Manage your business details and contact information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Business Name"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Business Address"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Contact Number"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
        {
            id: "tax",
            label: "Tax & VAT Configuration",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Tax & VAT Configuration
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Configure tax rates and VAT settings for your business
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="VAT Number"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Default Tax Rate (%)"
                            variant="outlined"
                            type="number"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
        {
            id: "currency",
            label: "Currency & Regional Settings",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Currency & Regional Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Set up your preferred currency and regional settings
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Default Currency"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Date Format"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Time Zone"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
        {
            id: "users",
            label: "User & Role Management",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        User & Role Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Manage user accounts and their permissions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Add New User"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Role"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
        {
            id: "email",
            label: "Email & Notification Settings",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Email & Notification Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Configure your email and notification preferences
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="SMTP Server"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
        {
            id: "backup",
            label: "System Backup & Restore",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        System Backup & Restore
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Manage your system backups and restoration options
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Create Backup
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Restore from Backup
                        </Button>
                    </Box>
                </Box>
            ),
        },
        {
            id: "api",
            label: "API & Third-Party Integrations",
            content: (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        API & Third-Party Integrations
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Configure API settings and manage third-party integrations
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="API Key"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="API Secret"
                            variant="outlined"
                            fullWidth
                            type="password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </Box>
            ),
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 8,
                    minHeight: '80vh',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
                Settings
            </DialogTitle>
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Navigation */}
                <Paper
                    elevation={0}
                    sx={{
                        width: 250,
                        borderRight: '1px solid #e0e0e0',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <List>
                        {settingsSections.map((section) => (
                            <React.Fragment key={section.id}>
                                <ListItem
                                    onClick={() => setActiveSection(section.id)}
                                    sx={{
                                        backgroundColor: activeSection === section.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                        cursor: 'pointer',
                                    }}
                                >
                                    <ListItemText
                                        primary={section.label}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontWeight: activeSection === section.id ? 'bold' : 'normal',
                                            }
                                        }}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Content Area */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <DialogContent dividers sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                        {settingsSections.find(section => section.id === activeSection)?.content}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "space-between", padding: "16px 24px", borderTop: '1px solid #e0e0e0' }}>
                        <Button onClick={onClose} sx={{ textTransform: "none" }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReset}
                            sx={{ textTransform: "none", display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <MdRestore /> Reset to Default
                        </Button>
                        <Button
                            onClick={handleSave}
                            color="primary"
                            variant="contained"
                            disabled={updateCustomizationMutation.isPending}
                            sx={{ textTransform: "none", borderRadius: 4 }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Dialog>
    );
};

export default SettingsModal;
