"use client";

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    greenAccent: Palette['primary'];
    brownAccent: Palette['primary'];
    purpleAccent: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    greenAccent?: PaletteOptions['primary'];
    brownAccent?: PaletteOptions['primary'];
    purpleAccent?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D9725B', // Laranja de botões e seleção
    },
    secondary: {
      main: '#323E50', // Cor secundária para fundos alternativos
    },
    background: {
      default: '#2D3540', // Fundo principal
      paper: '#323E50', // Fundo secundário (ex: cards)
    },
    text: {
      primary: '#FFFFFF', // Cor do texto padrão
      secondary: '#90A68A',
    },
    greenAccent: {
      main: '#90A68A',
    },
    brownAccent: {
      main: '#73573F',
    },
    purpleAccent: {
      main: '#6A4873',
    },
  },
  typography: {
    fontFamily: 'var(--font-family-base)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 'bold',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: '#D9725B',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme;
