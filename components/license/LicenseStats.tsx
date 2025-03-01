import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Key,
  Timer,
  Security,
  CheckCircle,
  Cancel,
  Refresh,
  ShowChart,
} from '@mui/icons-material';

interface Stats {
  totalLicenses: number;
  activeLicenses: number;
  programStats: Array<{
    programName: string;
    _count: {
      _all: number;
      isActive: number;
    };
  }>;
  expiringLicenses: Array<{
    id: number;
    programName: string;
    clientId: string;
    expiresAt: string;
  }>;
  recentAuthLogs: Array<{
    id: number;
    clientIp: string;
    status: boolean;
    message: string | null;
    createdAt: string;
    license: {
      programName: string;
      clientId: string;
    };
  }>;
}

function formatDateTime(date: Date | string | null): string | null {
  if (!date) return null;
  return new Date(date).toISOString().replace('T', ' ').replace('Z', '');
}

export default function LicenseStats() {
  const theme = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/license/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('통계 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress sx={{
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.palette.grey[200],
      }} />
    </Box>
  );

  if (!stats) return null;

  const activationRate = ((stats.activeLicenses / stats.totalLicenses) * 100) || 0;

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.grey[100], minHeight: '100vh' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 3,
        backgroundColor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}>
          라이선스 대시보드
        </Typography>
        <Tooltip title="새로고침">
          <IconButton
            onClick={fetchStats}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                transform: 'rotate(180deg)',
                transition: 'transform 0.5s'
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* 요약 통계 카드들 */}
        <Grid item xs={12} md={3}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Key sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">총 라이선스</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.totalLicenses.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChart sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">활성화율</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                {activationRate.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={activationRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 프로그램별 통계 */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>프로그램별 현황</Typography>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>프로그램명</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>총 라이선스</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>활성 라이선스</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>비활성 라이선스</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>활성화율</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.programStats.map((stat) => {
                      const rate = ((stat._count.isActive / stat._count._all) * 100) || 0;
                      const inactiveCount = stat._count._all - stat._count.isActive;
                      return (
                        <TableRow
                          key={stat.programName}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <TableCell>{stat.programName}</TableCell>
                          <TableCell align="center">{stat._count._all.toLocaleString()}</TableCell>
                          <TableCell align="center">{stat._count.isActive.toLocaleString()}</TableCell>
                          <TableCell align="center">{inactiveCount.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${rate.toFixed(1)}%`}
                              color={rate > 80 ? 'success' : rate > 50 ? 'warning' : 'error'}
                              size="small"
                              sx={{ minWidth: 80 }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 만료 예정 라이선스 */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ mr: 1, color: theme.palette.warning.main, fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>만료 예정 라이선스</Typography>
              </Box>
              <List>
                {stats.expiringLicenses.map((license) => (
                  <ListItem
                    key={license.id}
                    sx={{
                      bgcolor: theme.palette.warning.light,
                      borderRadius: 2,
                      mb: 1,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {license.programName}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${formatDateTime(license.expiresAt)} 만료`}
                            sx={{ ml: 1 }}
                            color="warning"
                          />
                        </Box>
                      }
                      secondary={license.clientId}
                    />
                  </ListItem>
                ))}
                {stats.expiringLicenses.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="만료 예정인 라이선스가 없습니다."
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 최근 인증 로그 */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: theme.palette.info.main, fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>최근 인증 시도</Typography>
              </Box>
              <List>
                {stats.recentAuthLogs.map((log) => (
                  <ListItem
                    key={log.id}
                    sx={{
                      bgcolor: log.status ? theme.palette.success.light : theme.palette.error.light,
                      borderRadius: 2,
                      mb: 1,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {log.license.programName}
                          </Typography>
                          <Chip
                            size="small"
                            icon={log.status ? <CheckCircle /> : <Cancel />}
                            label={log.status ? '성공' : '실패'}
                            color={log.status ? 'success' : 'error'}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {`${log.license.clientId} - ${log.clientIp} - ${new Date(log.createdAt).toLocaleString()}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}