import { createTheme } from "@mui/material/styles";

/**
 * Enhanced Material-UI theme with consistent spacing system
 * This extends the default MUI spacing to be more semantic and consistent
 */

// Define our spacing scale (8px base)
const spacingScale = {
  xs: 0.5, // 4px
  sm: 1, // 8px
  md: 2, // 16px
  lg: 3, // 24px
  xl: 4, // 32px
  xxl: 6, // 48px
  xxxl: 8, // 64px
};

// Create theme with enhanced spacing
export const createSpacingTheme = () =>
  createTheme({
    // Custom spacing function that supports our semantic names
    spacing: (factor: number | string) => {
      if (typeof factor === "string" && factor in spacingScale) {
        return `${spacingScale[factor as keyof typeof spacingScale] * 8}px`;
      }
      return `${(typeof factor === "number" ? factor : 1) * 8}px`;
    },

    // Component overrides for consistent spacing
    components: {
      // Paper/Card consistent styling
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "12px", // 3 * 4px
          },
        },
      },

      // Stack consistent spacing
      MuiStack: {
        defaultProps: {
          spacing: 2, // md spacing as default
        },
      },

      // Button consistent spacing
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // md radius
            textTransform: "none",
          },
          sizeSmall: {
            padding: "8px 16px", // sm/md spacing
          },
          sizeMedium: {
            padding: "12px 32px", // 1.5/xl spacing
          },
          sizeLarge: {
            padding: "16px 48px", // md/xxl spacing
          },
        },
      },

      // IconButton consistent sizing
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // md radius
          },
          sizeSmall: {
            padding: "4px", // xs spacing
          },
          sizeMedium: {
            padding: "8px", // sm spacing
          },
          sizeLarge: {
            padding: "12px", // 1.5 spacing
          },
        },
      },

      // Consistent form field spacing
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: "16px", // md spacing
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", // md radius
            },
          },
        },
      },

      // List items consistent spacing
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // md radius
            marginBottom: "4px", // xs spacing
          },
        },
      },

      // App bar consistent spacing
      MuiToolbar: {
        styleOverrides: {
          root: {
            paddingLeft: "16px !important", // md spacing
            paddingRight: "16px !important",
            "@media (min-width: 600px)": {
              paddingLeft: "24px !important", // lg spacing
              paddingRight: "24px !important",
            },
          },
        },
      },

      // Chip consistent styling
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "4px", // sm radius
          },
        },
      },

      // Dialog consistent spacing
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "24px", // lg spacing
          },
        },
      },

      // Progress bars
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: "24px", // xl radius
            height: "8px", // sm spacing for height
          },
        },
      },
    },

    // Custom breakpoints for spacing
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

// Utility functions for responsive spacing
export const responsiveSpacing = {
  containerPadding: {
    xs: 2, // 16px
    sm: 3, // 24px
  },
  sectionPadding: {
    xs: 4, // 32px
    md: 6, // 48px
  },
  cardMargin: {
    xs: 2, // 16px
    sm: 3, // 24px
  },
};
