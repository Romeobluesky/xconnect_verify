import { Box, Container } from '@mui/material';
import { PageTitle } from '@/src/components/page-title';
import UserManagement from '@/components/user/UserManagement';

export default function UsersPage() {
  return (
    <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
      <Container maxWidth="xl">
        <PageTitle title="사용자 관리" />
        <UserManagement />
      </Container>
    </Box>
  );
}