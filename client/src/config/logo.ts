export const LOGO_CONFIG = {
  // Configuración principal
  name: 'OALabs',
  fullName: 'OALabs - Laboratorios de Objetivos de Aprendizaje',
  tagline: 'Laboratorios de Objetivos de Aprendizaje',
  
  // Rutas de archivos
  paths: {
    horizontal: '/logo/logo-horizontal.svg',
    compact: '/logo/logo-compact.svg',
    vertical: '/logo/resources/logo-vertical.svg',
    minimal: '/logo/resources/logo-minimal.svg',
    iconOnly: '/logo/resources/logo-icon-only.svg',
    dark: '/logo/resources/logo-dark.svg',
    favicon: '/logo/favicon.svg'
  },
  
  // Configuración de tamaños
  sizes: {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  },
  
  // Configuración de colores
  colors: {
    primary: {
      start: '#3B82F6',
      end: '#1D4ED8'
    },
    accent: {
      start: '#10B981',
      end: '#059669'
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      light: '#FFFFFF'
    }
  },
  
  // Configuración de animaciones
  animations: {
    hover: 'hover:scale-105',
    transition: 'transition-all duration-200'
  }
} as const;

export type LogoVariant = keyof typeof LOGO_CONFIG.paths;
export type LogoSize = keyof typeof LOGO_CONFIG.sizes; 