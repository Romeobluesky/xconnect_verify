import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    neutral: {
      900: '#2f3746',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2f3746',
          color: '#ffffff',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      900: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      900: string;
    };
  }
}