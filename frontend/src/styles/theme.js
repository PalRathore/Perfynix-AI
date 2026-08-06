/**
 * Central color tokens for the app.
 * These mirror the CSS variables defined in global.css so that any
 * non-Tailwind context (charts, canvas, inline styles, third-party libs)
 * can read the exact same palette.
 */

export const themeColors = {
  dark: {
    background: '#020617',
    surface: '#111827',
    primary: '#8B5CF6',
    secondary: '#38BDF8',
    accent: '#22D3EE',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#7C3AED',
    secondary: '#2563EB',
    accent: '#0891B2',
  },
};

/**
 * Convenience getter, e.g. getThemeColors('dark').primary
 */
export function getThemeColors(mode = 'light') {
  return themeColors[mode] ?? themeColors.light;
}

export default themeColors;
