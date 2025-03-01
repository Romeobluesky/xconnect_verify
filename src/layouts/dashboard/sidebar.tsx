import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Theme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import KeyIcon from '@mui/icons-material/Key';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Link from 'next/link';

const SIDE_NAV_WIDTH = 218;

const items = [
  {
    href: '/admin/dashboard',
    icon: <DashboardIcon sx={{ color: 'aqua' }} />,
    title: '대시보드'
  },
  {
    href: '/admin/users',
    icon: <PeopleIcon sx={{ color: 'aqua' }} />,
    title: '사용자 관리'
  },
  {
    href: '/admin/licenses',
    icon: <KeyIcon sx={{ color: 'aqua' }} />,
    title: '라이선스 관리'
  },
  {
    href: '/admin/logs',
    icon: <ListAltIcon sx={{ color: 'aqua' }} />,
    title: '프로그램 상태'
  }
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#000000',
        width: SIDE_NAV_WIDTH
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            px: 3,
            py: 1,
            borderRadius: 1
          }}
        >
        <Link href="/admin/dashboard">
          <Image
            src="/tnn_logo_top.png"
            alt="Logo"
            width={100}
            height={0}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100px',
              filter: 'invert(1)'
            }}
          />
        </Link>
        </Box>
      </Box>
      <Box
        component="nav"
        sx={{ flexGrow: 1 }}
      >
        <List>
          {items.map((item) => (
            <ListItem disablePadding key={item.title}>
                <ListItemButton
                selected={router.pathname === item.href}
                onClick={() => router.push(item.href)}
                sx={{ gap: 0.1 }} // Reduce the gap between icon and text
                >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ color: 'white', fontSize: '0.875rem' }} // Reduce font size
                />
                </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 220
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 220
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
}