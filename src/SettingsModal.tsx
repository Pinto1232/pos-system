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

    return (
        <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { borderRadius: 8, padding: 2 } }}>
            <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
                 Customization Settings
            </DialogTitle>
            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                                        onClick={() => setShowSidebarColorPicker((prev) => !prev)} // Toggle visibility
                                    />
                                ),
                            }}
                        />
                        {showSidebarColorPicker && (
                            <Box sx={{ position: "absolute", zIndex: 2 }}>
                                <SketchPicker
                                    color={sidebarColor}
                                    onChange={(color: ColorResult) => setSidebarColor(color.hex)} // Explicitly type 'color'
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
                                        onClick={() => setShowNavbarColorPicker((prev) => !prev)} // Toggle visibility
                                    />
                                ),
                            }}
                        />
                        {showNavbarColorPicker && (
                            <Box sx={{ position: "absolute", zIndex: 2 }}>
                                <SketchPicker
                                    color={navbarColor}
                                    onChange={(color: ColorResult) => setNavbarColor(color.hex)} // Explicitly type 'color'
                                />
                            </Box>
                        )}
                    </>
                )}
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
