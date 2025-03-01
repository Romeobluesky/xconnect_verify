import Image from 'next/image';
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import {
  Key as KeyIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { text: '라이선스 관리', icon: <KeyIcon />, path: '/admin/dashboard' },
    { text: '사용자 관리', icon: <PeopleIcon />, path: '/admin/users' },
    { text: '로그 확인', icon: <AssessmentIcon />, path: '/admin/logs' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: 240,
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image
          src="/tnn_logo_top.png"
          alt="Logo"
          width={100}
          height={0}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100px',
          }}
          priority
        />
      </Box>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            selected={router.pathname === item.path}
            onClick={() => router.push(item.path)}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}