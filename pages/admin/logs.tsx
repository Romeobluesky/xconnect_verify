import { Box, Container } from '@mui/material';
import { PageTitle } from '@/src/components/page-title';
import ProgramStatus from '@/components/program/ProgramStatus';

function ProgramStatusPage() {
  return (
    <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
      <Container maxWidth="xl">
        <PageTitle title="프로그램 상태" />
        <ProgramStatus />
      </Container>
    </Box>
  );
}

export default ProgramStatusPage;