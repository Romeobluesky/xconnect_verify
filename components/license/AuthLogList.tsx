import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from '@mui/material';

interface AuthLog {
  id: number;
  licenseId: number;
  clientIp: string;
  status: boolean;
  message: string | null;
  createdAt: string;
}

interface Props {
  logs: AuthLog[];
}

export default function AuthLogList({ logs }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>시간</TableCell>
            <TableCell>IP 주소</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>메시지</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>{log.clientIp}</TableCell>
              <TableCell>
                <Chip
                  label={log.status ? '성공' : '실패'}
                  color={log.status ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{log.message || '-'}</TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary">
                  인증 기록이 없습니다.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}