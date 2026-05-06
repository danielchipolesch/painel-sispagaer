import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

/**
 * Color palette based on the SISPAGAER branding.
 * Dark navy blue for structure elements, light gray for backgrounds.
 */
const pagTheme = {
  dark: false,
  colors: {
    // Primary palette
    primary: '#0D1B3E',
    'primary-lighten-1': '#1A2F5A',
    'primary-lighten-2': '#264880',
    secondary: '#1565C0',
    accent: '#1976D2',

    // Surface palette
    background: '#ECEFF4',
    surface: '#FFFFFF',
    'surface-variant': '#E8EDF5',

    // Semantic colors
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#C62828',
    info: '#0277BD',

    // Text helpers (used via CSS variables)
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#212121',
    'on-surface': '#212121',

    // Chart accent colors (referenced in chartTheme.js as well)
    'chart-1': '#1976D2',
    'chart-2': '#43A047',
    'chart-3': '#FB8C00',
    'chart-4': '#E53935',
    'chart-5': '#8E24AA',
    'chart-6': '#00ACC1',
  },
}

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'pagTheme',
    themes: { pagTheme },
  },
  defaults: {
    VCard: {
      elevation: 1,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'md',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VChip: {
      rounded: 'md',
    },
  },
})
