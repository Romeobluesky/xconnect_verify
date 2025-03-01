import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface ActiveClient {
  id: number;
  programName: string;
  licenseKey: string;
  clientId: string;
  hardwareId: string | null;
  isActive: boolean;
  status: 'ISSUED' | 'IN_USE' | 'STOPPED';
  activatedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isRunning: boolean;
  userName?: string;
}

export default function ProgramStatus() {
  const [activeClients, setActiveClients] = useState<ActiveClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });
  const theme = useTheme();

  const fetchActiveClients = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/programs/active-clients?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      // clientId 기준으로 오름차순 정렬
      const sortedData = [...data].sort((a, b) => a.clientId.localeCompare(b.clientId));
      setActiveClients(sortedData);
    } catch (error) {
      console.error('활성 클라이언트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveClients();
    // 1분마다 데이터 갱신
    const interval = setInterval(fetchActiveClients, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const koreaDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);
      return format(koreaDate, 'PPP p', { locale: ko });
    } catch {
      return '날짜 정보 없음';
    }
  };

  const handleUpdateUserName = async (id: number, userName: string, clientId: string) => {
    try {
      const response = await fetch('/api/licenses/update-username', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userName })
      });

      if (!response.ok) throw new Error('사용자명 업데이트 실패');

      setSnackbar({
        open: true,
        message: `${clientId}의 사용자가 업데이트 되었습니다.`
      });

      fetchActiveClients();
    } catch (error) {
      console.error('사용자명 업데이트 실패:', error);
      setSnackbar({
        open: true,
        message: '업데이트 중 오류가 발생했습니다.'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Typography variant="h5">
          활성 클라이언트 ({Array.isArray(activeClients) ? activeClients.length : 0})
        </Typography>
        <Typography variant="h5" sx={{ color: theme.palette.success.main }}>
          실행 중 ({Array.isArray(activeClients) ? activeClients.filter(client => client.isRunning).length : 0})
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {activeClients.map((client) => (
          <Grid item xs={12} sm={6} md={2.4} key={client.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}`,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComputerIcon sx={{
                    color: client.isRunning ? theme.palette.success.main : theme.palette.error.main,
                    mr: 1
                  }} />
                  <Typography variant="h6" component="div" sx={{
                    flexGrow: 1,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    {client.clientId}
                  </Typography>
                  <Chip
                    label={client.isRunning ? "ON" : "OFF"}
                    size="small"
                    color={client.isRunning ? "success" : "error"}
                    sx={{
                      ml: 1,
                      width: '45px',
                      height: '18px',
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      '& .MuiChip-label': {
                        padding: '0',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={client.userName || ''}
                    placeholder="사용자명 입력"
                    onChange={(e) => {
                      const newUserName = e.target.value;
                      if (newUserName.length <= 12) {
                        const updatedClients = activeClients.map(c =>
                          c.id === client.id ? { ...c, userName: newUserName } : c
                        );
                        setActiveClients(updatedClients);
                      }
                    }}
                    inputProps={{
                      maxLength: 12,
                      style: {
                        padding: '2px 8px',
                        fontSize: '0.8rem',
                        height: '18px'
                      }
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        height: '24px'
                      }
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const updatedClients = activeClients.map(c =>
                        c.id === client.id ? { ...c, userName: '' } : c
                      );
                      setActiveClients(updatedClients);
                    }}
                    sx={{
                      padding: '3px',
                      bgcolor: theme.palette.grey[100],
                      '&:hover': {
                        bgcolor: theme.palette.grey[200]
                      }
                    }}
                  >
                    <ClearIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateUserName(client.id, client.userName || '', client.clientId)}
                    sx={{
                      padding: '3px',
                      bgcolor: theme.palette.grey[100],
                      '&:hover': {
                        bgcolor: theme.palette.grey[200]
                      }
                    }}
                  >
                    <CheckIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  {formatDate(client.activatedAt?.toString() || '')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {activeClients.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography>
                활성화된 클라이언트가 없습니다.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}