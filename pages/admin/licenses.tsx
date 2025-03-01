import { Box, Container } from '@mui/material';
import LicenseManagement from '@/components/license/LicenseManagement';

function LicensesPage() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3
      }}
    >
      <Container maxWidth="xl">
        <LicenseManagement />
      </Container>
    </Box>
  );
}

export default LicensesPage;