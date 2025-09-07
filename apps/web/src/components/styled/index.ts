/**
 * Pre-styled components for maximum reusability and uniformity
 * Replaces ALL common sx patterns: spacing, colors, dimensions, borders, etc.
 */

import { styled } from "@mui/material/styles";
import {
  Paper,
  Box,
  Stack,
  Container,
  IconButton,
  TextField,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";

// =============================================================================
// LAYOUT CONTAINERS
// =============================================================================

// Standard card - replaces most Paper components
export const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5), // 12px
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
  },
}));

// Small card variant
export const SmallCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1), // 8px
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

// Large card for main sections
export const LargeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2), // 16px
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
  position: "relative",
  overflow: "hidden",

  // Top colored border
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

// Content wrapper with responsive padding
export const ContentWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),

  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

// Section wrapper with consistent spacing
export const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6, 3),
  },
}));

// =============================================================================
// NAVIGATION & HEADER COMPONENTS
// =============================================================================

// Logo container with consistent sizing
export const LogoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1), // 8px
  overflow: "hidden",
  background: `${theme.palette.primary.main}15`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  [theme.breakpoints.up("sm")]: {
    width: 50,
    height: 50,
  },
}));

// Header section with consistent spacing
export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),

  "& h1, & h2, & h3": {
    marginBottom: theme.spacing(2),
  },

  "& p": {
    marginBottom: theme.spacing(1),
  },
}));

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

// Standard action button with consistent styling
export const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}15`,
  color: theme.palette.primary.main,
  borderRadius: "50%", // Fully circular
  width: 40,
  height: 40,

  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}25`,
  },

  transition: "all 0.2s ease-in-out",

  [theme.breakpoints.down("sm")]: {
    width: 36,
    height: 36,
  },
}));

// Success action button (like add buttons)
export const SuccessButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: `${theme.palette.success.main}15`,
  color: theme.palette.success.main,
  borderRadius: theme.spacing(1),
  width: 40,
  height: 40,

  "&:hover": {
    backgroundColor: `${theme.palette.success.main}25`,
    transform: "scale(1.1)",
  },

  transition: "all 0.2s ease-in-out",

  [theme.breakpoints.down("sm")]: {
    width: 36,
    height: 36,
  },
}));

// Button group with consistent spacing
export const ActionButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1.5),
    alignItems: "stretch",
  },
}));

// =============================================================================
// STACK COMPONENTS
// =============================================================================

export const SmallStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1), // 8px
}));

export const MediumStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2), // 16px
}));

export const LargeStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3), // 24px
}));

// =============================================================================
// FORM COMPONENTS
// =============================================================================

// Form container with consistent spacing between elements
export const FormContainer = styled(Box)(({ theme }) => ({
  "& > *": {
    marginBottom: `${theme.spacing(2)} !important`,
  },

  "& > *:last-child": {
    marginBottom: "0 !important",
  },
}));

// Standard form field with consistent styling
export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),

  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1), // 8px
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.8)",

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// =============================================================================
// LIST COMPONENTS
// =============================================================================

// List container with consistent spacing
export const ListContainer = styled(Box)(({ theme }) => ({
  "& > *": {
    marginBottom: theme.spacing(1),
  },

  "& > *:last-child": {
    marginBottom: 0,
  },
}));

// Standard list item with hover effects
export const ListItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1), // 8px
  background: theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

// =============================================================================
// PROGRESS & LOADING COMPONENTS
// =============================================================================

// Enhanced progress bar with consistent styling
export const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: theme.spacing(0.75), // 6px
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f0f0f0",

  "& .MuiLinearProgress-bar": {
    borderRadius: theme.spacing(0.75),
  },
}));

// Skeleton with consistent styling
export const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

// =============================================================================
// METRIC & DISPLAY COMPONENTS
// =============================================================================

// Metric display for stats and numbers
export const MetricDisplay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2), // 16px
  textAlign: "center",
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",

  "& > *:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
}));

// Icon with background container
export const IconContainer = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1), // 8px
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

// =============================================================================
// CHIP COMPONENTS
// =============================================================================

// Standard chip with consistent styling
export const StyledChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: "0.7rem",
  borderRadius: theme.spacing(0.5), // 4px

  "& .MuiChip-icon": {
    fontSize: 12,
  },
}));

// Status chip variants
export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: "success" | "warning" | "error" | "info" }>(
  ({ theme, status = "info" }) => ({
    height: 24,
    fontSize: "0.75rem",
    fontWeight: 500,
    borderRadius: theme.spacing(1),

    ...(status === "success" && {
      backgroundColor: `${theme.palette.success.main}15`,
      color: theme.palette.success.main,
    }),

    ...(status === "warning" && {
      backgroundColor: `${theme.palette.warning.main}15`,
      color: theme.palette.warning.main,
    }),

    ...(status === "error" && {
      backgroundColor: `${theme.palette.error.main}15`,
      color: theme.palette.error.main,
    }),

    ...(status === "info" && {
      backgroundColor: `${theme.palette.info.main}15`,
      color: theme.palette.info.main,
    }),
  })
);

// =============================================================================
// SEARCH & INPUT COMPONENTS
// =============================================================================

// Search field with consistent styling
export const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1), // 8px
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.8)",

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// =============================================================================
// DIALOG COMPONENTS
// =============================================================================

// Dialog content wrapper with proper spacing
export const DialogContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),

  "& > *:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));
