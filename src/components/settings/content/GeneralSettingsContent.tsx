import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import Image from 'next/image';
import { FaPaintBrush } from 'react-icons/fa';
import { SketchPicker, ColorResult } from 'react-color';

interface GeneralSettingsContentProps {
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
  navbarColor: string;
  setNavbarColor: (color: string) => void;
  logoPreview: string;
  showSidebarColorPicker: boolean;
  setShowSidebarColorPicker: (show: boolean) => void;
  showNavbarColorPicker: boolean;
  setShowNavbarColorPicker: (show: boolean) => void;
  handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralSettingsContent: React.FC<GeneralSettingsContentProps> = ({
  sidebarColor,
  setSidebarColor,
  navbarColor,
  setNavbarColor,
  logoPreview,
  showSidebarColorPicker,
  setShowSidebarColorPicker,
  showNavbarColorPicker,
  setShowNavbarColorPicker,
  handleLogoFileChange,
}) => {
  const DEFAULT_SIDEBAR_COLOR = '#173A79';
  const DEFAULT_NAVBAR_COLOR = '#000000';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        General Settings
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            bgcolor: '#f9f9f9',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Company Logo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Upload your company logo to display in the application.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  borderRadius: 4,
                }}
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    width={80}
                    height={80}
                    style={{
                      objectFit: 'cover',
                    }}
                    unoptimized
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No logo
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="body2">Recommended size: 200x200 pixels</Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: JPG, PNG, SVG
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={
                <Box
                  component="span"
                  sx={{
                    fontSize: '1.2rem',
                  }}
                >
                  📤
                </Box>
              }
              sx={{
                textTransform: 'none',
                borderRadius: 4,
                height: '36px',
              }}
            >
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoFileChange} style={{ display: 'none' }} />
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            bgcolor: '#f9f9f9',
            mt: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Theme Colors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Customize the colors of your application interface.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Theme Presets
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  name: 'Corporate',
                  sidebar: '#173A79',
                  navbar: '#000000',
                },
                {
                  name: 'Light',
                  sidebar: '#ffffff',
                  navbar: '#f5f5f5',
                },
                {
                  name: 'Dark',
                  sidebar: '#1e1e1e',
                  navbar: '#2d2d2d',
                },
                {
                  name: 'Vibrant',
                  sidebar: '#2E7D32',
                  navbar: '#1565C0',
                },
              ].map((theme) => (
                <Box
                  key={theme.name}
                  onClick={() => {
                    setSidebarColor(theme.sidebar);
                    setNavbarColor(theme.navbar);
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    width: '80px',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      height: '30px',
                      mb: 1,
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '60%',
                        bgcolor: theme.sidebar,
                      }}
                    />
                    <Box
                      sx={{
                        width: '40%',
                        bgcolor: theme.navbar,
                      }}
                    />
                  </Box>
                  <Typography variant="caption">{theme.name}</Typography>
                </Box>
              ))}
              <Box
                onClick={() => {
                  setSidebarColor(DEFAULT_SIDEBAR_COLOR);
                  setNavbarColor(DEFAULT_NAVBAR_COLOR);
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  p: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  width: '80px',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Typography variant="caption">Reset to Default</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body1" sx={{ width: '120px' }}>
                Sidebar Color
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: sidebarColor,
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => setShowSidebarColorPicker(!showSidebarColorPicker)}
                >
                  <FaPaintBrush color={sidebarColor === '#ffffff' || sidebarColor === '#f5f5f5' ? '#000' : '#fff'} size={16} />
                </Box>
                <TextField value={sidebarColor} onChange={(e) => setSidebarColor(e.target.value)} size="small" sx={{ width: '140px' }} />
                {showSidebarColorPicker && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      mt: 20,
                      ml: 5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      maxHeight: 'calc(100vh - 100px)',
                      overflow: 'auto',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                      onClick={() => setShowSidebarColorPicker(false)}
                    />
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <SketchPicker color={sidebarColor} onChange={(color: ColorResult) => setSidebarColor(color.hex)} />
                    </Box>
                  </Box>
                )}
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSidebarColor(DEFAULT_SIDEBAR_COLOR)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  height: '36px',
                  minWidth: '80px',
                }}
              >
                Reset
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body1" sx={{ width: '120px' }}>
                Navbar Color
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: navbarColor,
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => setShowNavbarColorPicker(!showNavbarColorPicker)}
                >
                  <FaPaintBrush color={navbarColor === '#ffffff' || navbarColor === '#f5f5f5' ? '#000' : '#fff'} size={16} />
                </Box>
                <TextField value={navbarColor} onChange={(e) => setNavbarColor(e.target.value)} size="small" sx={{ width: '140px' }} />
                {showNavbarColorPicker && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      mt: 20,
                      ml: 5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      maxHeight: 'calc(100vh - 100px)',
                      overflow: 'auto',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                      onClick={() => setShowNavbarColorPicker(false)}
                    />
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <SketchPicker color={navbarColor} onChange={(color: ColorResult) => setNavbarColor(color.hex)} />
                    </Box>
                  </Box>
                )}
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setNavbarColor(DEFAULT_NAVBAR_COLOR)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  height: '36px',
                  minWidth: '80px',
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            bgcolor: '#f9f9f9',
            mt: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Interface Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Configure how the application interface behaves.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">Compact Mode</Typography>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  minWidth: '100px',
                  borderRadius: 4,
                  textTransform: 'none',
                }}
              >
                Disabled
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">Dark Mode</Typography>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  minWidth: '100px',
                  borderRadius: 4,
                  textTransform: 'none',
                }}
              >
                Disabled
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">Animations</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  minWidth: '100px',
                  borderRadius: 4,
                  textTransform: 'none',
                }}
              >
                Enabled
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralSettingsContent;
