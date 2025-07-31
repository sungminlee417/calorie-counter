# 🎨 Theme System Documentation

## Overview

The application now supports a comprehensive theme system with three modes:
- **Light Mode**: Always uses light theme
- **Dark Mode**: Always uses dark theme  
- **System Mode**: Automatically follows the user's system/OS preference

## Features

### 🔄 **Theme Modes**
- **Light**: Fixed light theme regardless of system preference
- **Dark**: Fixed dark theme regardless of system preference
- **System**: Dynamically adapts to system preference changes

### 🎯 **Smart Defaults**
- Default preference: `system` (follows OS setting)
- Persistent storage: User preference saved in localStorage
- Real-time updates: Automatically detects system theme changes

### 🖱️ **User Interface**
- **Theme Selector**: Dropdown menu in navigation bar
- **Visual Indicators**: Clear icons for each mode (☀️ Light, 🌙 Dark, ⚙️ System)
- **Smart Tooltips**: Shows current mode and resolved theme
- **Accessibility**: Full keyboard navigation and screen reader support

## Implementation Details

### 📁 **File Structure**
```
src/
├── constants/app.ts           # Theme constants and types
├── context/
│   ├── ThemeModeContext.tsx   # Main theme context
│   └── __tests__/
│       └── ThemeModeContext.test.tsx  # Theme tests
├── components/ui/
│   ├── ThemeSelector.tsx      # Advanced theme selector component
│   └── Navigation.tsx         # Updated navigation with theme selector
└── app/providers.tsx          # Updated providers
```

### 🎛️ **Context API**
```typescript
interface ThemeModeContextValue {
  preference: ThemePreference;      // User's selected preference
  resolvedTheme: ResolvedTheme;     // Actual theme being used
  setThemePreference: (preference: ThemePreference) => void;
  toggleMode: () => void;           // Cycles through: light → dark → system
  systemTheme: ResolvedTheme;       // Current system preference
}
```

### 🔧 **Constants**
```typescript
export const THEME = {
  STORAGE_KEY: "theme-preference",
  MODES: {
    LIGHT: "light",
    DARK: "dark", 
    SYSTEM: "system",
  },
  DEFAULT_MODE: "system",
} as const;
```

## Usage Examples

### 🎨 **Using the Theme Context**
```typescript
import { useThemeMode } from '@/context/ThemeModeContext';

function MyComponent() {
  const { preference, resolvedTheme, setThemePreference } = useThemeMode();
  
  return (
    <div>
      <p>Current preference: {preference}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setThemePreference('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### 🎚️ **Theme-Aware Styling**
The theme automatically applies to all MUI components via the ThemeProvider. For custom styling:

```typescript
import { useTheme } from '@mui/material';

function CustomComponent() {
  const theme = useTheme();
  
  const styles = {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[200]
  };
  
  return <div style={styles}>Theme-aware content</div>;
}
```

## Browser Support

### 🌐 **System Theme Detection**
- Modern browsers: Uses `addEventListener` on `matchMedia`
- Legacy browsers: Falls back to `addListener`/`removeListener`
- No support: Defaults to light theme

### 💾 **Storage**
- Uses `localStorage` for persistence
- Graceful degradation when localStorage unavailable
- Automatic migration from old storage keys

## Testing

### 🧪 **Test Coverage**
- Theme preference persistence
- System theme detection
- Theme cycling/toggling
- Context provider functionality
- LocalStorage integration

### 🔧 **Running Tests**
```bash
npm test -- ThemeModeContext.test.tsx
```

## Migration Guide

### 🔄 **From Old Theme System**
The old system used a simple `mode` property. The new system:

**Before:**
```typescript
const { mode, toggleMode } = useThemeMode();
```

**After:**
```typescript
const { resolvedTheme, preference, toggleMode } = useThemeMode();
// Use resolvedTheme instead of mode for the actual theme
// Use preference to see what user selected
```

### 📦 **Storage Migration**
- Old key: `mui-theme-mode` → New key: `theme-preference`
- Old values: `light|dark` → New values: `light|dark|system`
- Automatic migration handles existing user preferences

## Advanced Features

### 🎯 **System Theme Monitoring**
Automatically detects when user changes their OS theme preference and updates the resolved theme accordingly when in system mode.

### 🔄 **Intelligent Cycling**
The toggle function cycles through themes in a logical order:
1. Light → Dark (standard toggle)
2. Dark → System (respects user's OS preference)  
3. System → Light (back to manual control)

### ⚡ **Performance Optimizations**
- Memoized context values prevent unnecessary re-renders
- Efficient event listener management
- Minimal localStorage operations

## Accessibility

### ♿ **Screen Reader Support**
- Descriptive aria-labels for theme buttons
- Announces current theme state
- Clear focus indicators

### ⌨️ **Keyboard Navigation**
- Full keyboard access to theme selector
- Standard menu navigation patterns
- Escape key closes theme menu

### 🎨 **Visual Indicators**
- Distinct icons for each theme mode
- Tooltips explain current state
- Clear visual feedback for selections

---

## 🚀 **Quick Start**

1. **Theme is ready to use!** The system automatically detects and applies the user's preference.

2. **Theme selector** is already integrated into the navigation bar.

3. **All existing components** automatically inherit the theme.

4. **To customize** theme-aware components, use the `useThemeMode()` hook.

The theme system is now production-ready with comprehensive testing, accessibility support, and seamless user experience! 🎉