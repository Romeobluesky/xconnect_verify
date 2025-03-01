import { Box } from '@mui/material';
import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px', // Sidebar width
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}