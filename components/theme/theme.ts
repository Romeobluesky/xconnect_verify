import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,  // 모든 버튼의 라운드 효과 제거
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,  // Paper 컴포넌트의 라운드 효과도 제거
        },
      },
    },
  },
});

export default theme;