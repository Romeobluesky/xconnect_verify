import { Typography, Box } from '@mui/material';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h4">{title}</Typography>
  </Box>
);