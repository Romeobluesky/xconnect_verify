import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
  Theme,
  Button,
  Typography,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut, useSession } from 'next-auth/react';

const NavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

interface DashboardNavbarProps {
  onSidebarOpen: () => void;
}

export default function DashboardNavbar({ onSidebarOpen }: DashboardNavbarProps) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/login',
      redirect: true 
    });
  };

  return (
    <NavbarRoot>
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2
        }}
      >
        {!lgUp && (
          <IconButton onClick={onSidebarOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="textSecondary">
              {session?.user ? `${session.user.name}(${session.user.email})` : '로딩 중...'}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{ height: 32 }}
          >
            로그아웃
          </Button>
        </Stack>
      </Toolbar>
    </NavbarRoot>
  );
}