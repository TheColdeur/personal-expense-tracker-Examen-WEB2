// theme.ts

export const colors = {
  primary: '#FFD700',       // Jaune impactant
  secondary: '#FFFFFF',     // Blanc pur
  accent: '#000000',        // Noir profond
  muted: '#F5F5F5',         // Gris clair pour les fonds
  danger: '#FF4C4C',        // Pour les alertes
  success: '#4CAF50',       // Pour les validations
};

export const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Inter', sans-serif`,
  mono: `'Fira Code', monospace`,
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const radii = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
};

export const shadows = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.05)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
  strong: '0 6px 20px rgba(0, 0, 0, 0.15)',
};

export const theme = {
  colors,
  fonts,
  spacing,
  radii,
  shadows,
};
