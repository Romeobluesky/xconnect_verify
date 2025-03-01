import {
  Box,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Activity {
  id: number;
  type: string;
  message: string;
  programName: string;
  createdAt: string | Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader title="최근 활동" />
      <List>
        {activities.map((activity, i) => (
          <Box key={activity.id}>
            {i > 0 && <Divider />}
            <ListItem>
              <ListItemText
                primary={activity.message}
                secondary={
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="caption"
                  >
                    {format(
                      typeof activity.createdAt === 'string'
                        ? new Date(activity.createdAt)
                        : activity.createdAt,
                      'PPP p',
                      { locale: ko }
                    )}
                    {' · '}
                    {activity.programName}
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Card>
  );
};