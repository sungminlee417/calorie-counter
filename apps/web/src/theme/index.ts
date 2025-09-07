import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createSpacingTheme } from "./spacing";

// Create the main theme that includes our spacing system
export const theme = createTheme({
  // Include our spacing theme
  ...createSpacingTheme(),

  // You can add other theme customizations here
  palette: {
    // Your existing color palette
    mode: "light", // or 'dark'
  },

  typography: {
    // Your existing typography settings
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export { createSpacingTheme, ThemeProvider };
