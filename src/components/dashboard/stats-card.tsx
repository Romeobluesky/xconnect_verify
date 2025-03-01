import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, SvgIconProps } from '@mui/material';

interface StatsCardProps {
  difference?: number;
  positive?: boolean;
  title: string;
  value: string;
  icon: React.ReactElement<SvgIconProps>;
  color?: string;
}

export const StatsCard = ({
  difference,
  positive = false,
  title,
  value,
  icon,
  color = 'primary.main'
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: color,
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              {icon}
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Typography
              color={positive ? 'success.main' : 'error.main'}
              variant="body2"
            >
              {difference}%
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              전월 대비
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};