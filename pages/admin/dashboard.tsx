import { useEffect, useState } from 'react';
import { Box, Container, Grid, CircularProgress } from '@mui/material';
import { PageTitle } from '@/src/components/page-title';
import KeyIcon from '@mui/icons-material/Key';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import dynamic from 'next/dynamic';

// 동적 임포트
const StatsCard = dynamic(() => import('@/src/components/dashboard/stats-card').then(mod => mod.StatsCard), { ssr: false });
const LicenseChart = dynamic(() => import('@/src/components/dashboard/license-chart').then(mod => mod.LicenseChart), { ssr: false });

interface DashboardStats {
  stats: {
    totalLicenses: number;
    activeLicenses: number;
    inUseLicenses: number;
    utilizationRate: number;
  };
  monthlyStats: Array<{
    month: string;
    total: number;
    inUse: number;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const result = await response.json();
        if (result && result.stats) {
          setData(result);
        }
      } catch (error) {
        console.error('통계 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 3 }}>
          <PageTitle title="대시보드" />
        </Box>
        {loading || !data?.stats ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="총 라이선스"
                value={String(data.stats.totalLicenses)}
                icon={<KeyIcon />}
                color="#3F51B5"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="활성 라이선스"
                value={String(data.stats.activeLicenses)}
                icon={<CheckCircleIcon />}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="사용중 라이선스"
                value={String(data.stats.inUseLicenses)}
                icon={<TrendingUpIcon />}
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="사용률"
                value={`${data.stats.utilizationRate}%`}
                icon={<TrendingUpIcon />}
                color="#E91E63"
              />
            </Grid>
            <Grid item xs={12}>
              <LicenseChart data={data.monthlyStats} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}