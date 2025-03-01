import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { useState } from 'react';

// 동적 임포트로 변경
const Navbar = dynamic(() => import('./navbar'), { ssr: false });
const Sidebar = dynamic(() => import('./sidebar'), { ssr: false });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onSidebarOpen={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          px: { xs: 4, lg: 8 },
          mt: 8,
          ml: { xs: 0, lg: '240px' },
          transition: 'margin 0.2s ease-in-out'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}