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
    ListItemButton,
    ListItemText,
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

interface SettingsItem {
    label: string;
}

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    onCustomizationUpdated: (updated: UserCustomization) => void;
}

const settingsItems: SettingsItem[] = [
    { label: "General Settings" },
    { label: "Business Information" },
    { label: "Tax & VAT Configuration" },
    { label: "Currency & Regional Settings" },
    { label: "User & Role Management" },
    { label: "Email & Notification Settings" },
    { label: "System Backup & Restore" },
    { label: "API & Third-Party Integrations" },
];

const DEFAULT_SIDEBAR_COLOR = "#173A79";
const DEFAULT_LOGO_URL = "/Pisval_Logo.jpg";
const DEFAULT_NAVBAR_COLOR = "#000000";

const fetchCustomization = async (userId: string): Promise<UserCustomization> => {
    const response = await apiClient.get(`/api/UserCustomization/${userId}`);
    return response.data;
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

    const [sidebarColor, setSidebarColor] = useState("");
    const [navbarColor, setNavbarColor] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [showSidebarColorPicker, setShowSidebarColorPicker] = useState(false);
    const [showNavbarColorPicker, setShowNavbarColorPicker] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState("General Settings");

    useEffect(() => {
        if (data) {
            setSidebarColor(data.sidebarColor);
            setNavbarColor(data.navbarColor);
            setLogoPreview(data.logoUrl);
        } else {

            setSidebarColor(DEFAULT_SIDEBAR_COLOR);
            setNavbarColor(DEFAULT_NAVBAR_COLOR);
            setLogoPreview(DEFAULT_LOGO_URL);
        }
    }, [data, open]);

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
            // In production, upload the file and set the returned URL.
        }
    };

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


    const handleReset = () => {
        setSidebarColor(DEFAULT_SIDEBAR_COLOR);
        setNavbarColor(DEFAULT_NAVBAR_COLOR);
        setLogoPreview(DEFAULT_LOGO_URL);
    };

    // Render content based on selected setting
    const renderSettingContent = () => {
        switch (selectedSetting) {
            case "General Settings":
                return (
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
                );
            case "Business Information":
                return <Typography>Business Information settings will be available soon.</Typography>;
            case "Tax & VAT Configuration":
                return <Typography>Tax & VAT Configuration settings will be available soon.</Typography>;
            case "Currency & Regional Settings":
                return <Typography>Currency & Regional Settings will be available soon.</Typography>;
            case "User & Role Management":
                return <Typography>User & Role Management settings will be available soon.</Typography>;
            case "Email & Notification Settings":
                return <Typography>Email & Notification Settings will be available soon.</Typography>;
            case "System Backup & Restore":
                return <Typography>System Backup & Restore options will be available soon.</Typography>;
            case "API & Third-Party Integrations":
                return <Typography>API & Third-Party Integrations settings will be available soon.</Typography>;
            default:
                return <Typography>Select a setting from the sidebar.</Typography>;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{ "& .MuiDialog-paper": { borderRadius: 8, padding: 2 } }}
        >
            <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
                Settings
            </DialogTitle>
            <DialogContent dividers sx={{ display: "flex", padding: 0 }}>
                {/* Settings Sidebar */}
                <Box sx={{
                    width: "250px",
                    borderRight: "1px solid #e0e0e0",
                    overflowY: "auto",
                    bgcolor: "#f5f5f5"
                }}>
                    <List component="nav" aria-label="settings categories">
                        {settingsItems.map((item) => (
                            <ListItemButton
                                key={item.label}
                                onClick={() => setSelectedSetting(item.label)}
                                selected={selectedSetting === item.label}
                                sx={{
                                    borderLeft: selectedSetting === item.label ? "4px solid #173A79" : "4px solid transparent",
                                    bgcolor: selectedSetting === item.label ? "rgba(23, 58, 121, 0.08)" : "transparent",
                                    "&:hover": {
                                        bgcolor: "rgba(23, 58, 121, 0.04)",
                                    }
                                }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                {/* Settings Content */}
                <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    {isLoading && <Typography>Loading customization...</Typography>}
                    {error && <Typography color="error">{error.message}</Typography>}
                    {data && renderSettingContent()}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", padding: "16px 24px" }}>
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
        </Dialog>
    );
};

export default SettingsModal;
