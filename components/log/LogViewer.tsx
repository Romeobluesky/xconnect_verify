import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Scrollbar } from '@/src/components/scrollbar';

interface Log {
  id: number;
  licenseId: number;
  clientIp: string;
  status: boolean;
  message: string | null;
  createdAt: string;
  license: {
    programName: string;
    clientId: string;
  };
}

export default function LogViewer() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLogs = useCallback(async () => {
    if (isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/logs?page=${page}&filter=${filter}`,
        {
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (!response.ok) throw new Error('서버 에러');

      const data = await response.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('로그 조회 실패:', error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [page, filter, isLoading]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchLogs();
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchLogs]);

  return (
    <Card>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">인증 로그</Typography>
        <TextField
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value="success">성공</MenuItem>
          <MenuItem value="failure">실패</MenuItem>
        </TextField>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>시간</TableCell>
                <TableCell>프로그램</TableCell>
                <TableCell>클라이언트 ID</TableCell>
                <TableCell>IP 주소</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>메시지</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow hover key={log.id}>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{log.license.programName}</TableCell>
                  <TableCell>{log.license.clientId}</TableCell>
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
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={totalPages * 10}
        page={page - 1}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </Card>
  );
}