import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  month: string;
  total: number;
  inUse: number;
}

const DynamicChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false
});

export const LicenseChart = ({ data }: { data: ChartData[] }) => {
  const theme = useTheme();

  const chartData = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        data: data.map(item => item.total),
        label: '라이선스 발급',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#4CAF50',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        data: data.map(item => item.inUse),
        label: '사용중',
        maxBarThickness: 10
      }
    ],
    labels: data.map(item => {
      const month = item.month.split('-')[1];
      return `${month}월`;
    })
  };

  const options: ChartOptions<'bar'> = {
    animation: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        enabled: true,
        footerColor: theme.palette.text.secondary,
        intersect: false,
        mode: 'index',
        titleColor: theme.palette.text.primary
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          display: true
        },
        border: {
          display: false
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader
        title="라이선스 통계"
        subheader="월별 라이선스 발급 및 활성화 현황"
      />
      <CardContent>
        <DynamicChart
          data={chartData}
          options={options}
          height={364}
        />
      </CardContent>
    </Card>
  );
};