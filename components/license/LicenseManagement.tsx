import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Switch,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import LicenseFormModal from './LicenseFormModal';
import DownloadIcon from '@mui/icons-material/Download';
import BulkLicenseModal from './BulkLicenseModal';
import ImportLicenseModal from './ImportLicenseModal';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BulkDeleteModal from './BulkDeleteModal';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';

interface License {
  id: number;
  programName: string;
  clientId: string;
  isActive: boolean;
  status: 'ISSUED' | 'IN_USE' | 'STOPPED';
  expiresAt: string;
  createdAt: string;
  licenseKey: string;
  activatedAt: string | null;
}

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [dateType, setDateType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchLicenses = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
        search: searchTerm
      });

      if (status) params.append('status', status);
      if (dateType && startDate && endDate) {
        params.append('dateType', dateType);
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      const response = await fetch(`/api/licenses?${params}`);
      const data = await response.json();
      setLicenses(data.licenses);
      setTotalCount(data.total);
    } catch (error) {
      console.error('라이선스 목록 조회 실패:', error);
    }
  }, [page, searchTerm, rowsPerPage, status, dateType, startDate, endDate]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchLicenses();
    }, 300);

    return () => clearTimeout(debounce);
  }, [fetchLicenses]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleBulkAdd = async (data: { programName: string; count: number; expiresAt: Date }) => {
    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('라이선스 추가 실패');

      // 목록 새로고침
      const refreshResponse = await fetch(`/api/licenses?page=${page + 1}&limit=${rowsPerPage}`);
      const refreshData = await refreshResponse.json();
      setLicenses(refreshData.licenses);
      setTotalCount(refreshData.total);
      setIsBulkModalOpen(false);
    } catch (error) {
      console.error('라이선스 추가 실패:', error);
    }
  };

  const handleExport = async () => {
    try {
      // 전체 라이선스 데이터 조회
      const response = await fetch('/api/licenses/export');
      if (!response.ok) throw new Error('데이터 조회 실패');
      const data = await response.json();
      const allLicenses = data.licenses;

      // XLSX 형식의 데이터 생성
      const header = ['프로그램', '클라이언트 ID', '라이선스 키', '상태', '인증일', '만료일', '생성일'];
      const rows = allLicenses.map((license: License) => [
        license.programName,
        license.clientId,
        license.licenseKey,
        license.status === 'IN_USE' ? '사용중' :
        license.status === 'STOPPED' ? '정지' : '발급됨',
        license.activatedAt ? format(new Date(license.activatedAt), 'yyyy-MM-dd', { locale: ko }) : '-',
        format(new Date(license.expiresAt), 'yyyy-MM-dd', { locale: ko }),
        format(new Date(license.createdAt), 'yyyy-MM-dd', { locale: ko })
      ]);

      // 엑셀 파일 생성
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
      XLSX.utils.book_append_sheet(workbook, worksheet, '라이선스 목록');

      // 파일 다운로드
      XLSX.writeFile(workbook, `licenses_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } catch (error) {
      console.error('라이선스 내보내기 실패:', error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());
      const licenses = rows.slice(1).map(row => {
        const [programName, clientId, expiresAt] = row.split(',');
        return { programName, clientId, expiresAt };
      });

      const response = await fetch('/api/licenses/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(licenses),
      });

      if (!response.ok) throw new Error('라이선스 가져오기 실패');

      // 목록 새로고침
      const refreshResponse = await fetch(`/api/licenses?page=${page + 1}&limit=${rowsPerPage}`);
      const refreshData = await refreshResponse.json();
      setLicenses(refreshData.licenses);
      setTotalCount(refreshData.total);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('라이선스 가져오기 실패:', error);
      // TODO: 에러 처리
    }
  };

  const handleSingleAdd = async (data: { programName: string; clientId: string; expiresAt: Date }) => {
    try {
      const response = await fetch('/api/licenses/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('라이선스 추가 실패');

      // 목록 새로고침
      const refreshResponse = await fetch(`/api/licenses?page=${page + 1}&limit=${rowsPerPage}`);
      const refreshData = await refreshResponse.json();
      setLicenses(refreshData.licenses);
      setTotalCount(refreshData.total);
      setIsSingleModalOpen(false);
    } catch (error) {
      console.error('라이선스 추가 실패:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);  // 검색 시 첫 페이지로 이동
  };

  const handleBulkDelete = async (criteria: { programName?: string; status?: 'ISSUED' | 'IN_USE' }) => {
    try {
      const response = await fetch('/api/licenses/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) throw new Error('라이선스 삭제 실패');

      fetchLicenses();
    } catch (error) {
      console.error('라이선스 삭제 실패:', error);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      const response = await fetch('/api/licenses/toggle-active', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isActive: !currentActive
        }),
      });

      if (!response.ok) throw new Error('상태 변경 실패');

      // 성공 시 목록 새로고침
      fetchLicenses();
    } catch (error) {
      console.error('라이선스 상태 변경 실패:', error);
    }
  };

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            라이선스 관리
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              size="small"
              sx={{ height: 40 }}
              onClick={() => setIsSingleModalOpen(true)}
            >
              라이선스 추가
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              sx={{ height: 40 }}
              onClick={() => setIsBulkModalOpen(true)}
            >
              대량 추가
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              size="small"
              sx={{ height: 40 }}
              onClick={handleExport}
            >
              내보내기
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              size="small"
              sx={{
                height: 40,
                bgcolor: 'darkred',
                '&:hover': {
                  bgcolor: '#8B0000'
                }
              }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              일괄 삭제
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <TextField
            placeholder="프로그램 이름 또는 클라이언트 ID로 검색"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              width: 300,
              '& .MuiInputBase-root': {
                height: 40
              }
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>상태</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="상태"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="IN_USE">사용중</MenuItem>
              <MenuItem value="STOPPED">정지</MenuItem>
              <MenuItem value="ISSUED">발급됨</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>날짜 유형</InputLabel>
            <Select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              label="날짜 유형"
            >
              <MenuItem value="">선택</MenuItem>
              <MenuItem value="activatedAt">인증일</MenuItem>
              <MenuItem value="expiresAt">만료일</MenuItem>
              <MenuItem value="createdAt">생성일</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              disabled={!dateType}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              disabled={!dateType}
            />
          </LocalizationProvider>
        </Stack>
      </Box>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>프로그램</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>라이선스 키</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>클라이언트 ID</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>상태</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>인증일</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>만료일</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>생성일</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>스위치</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenses.map((license) => (
              <TableRow hover key={license.id}>
                <TableCell style={{ textAlign: 'center' }}>{license.programName}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{license.licenseKey}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{license.clientId}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Chip
                    label={
                      license.status === 'IN_USE' ? '사용중' :
                      license.status === 'STOPPED' ? '정지' : '발급됨'
                    }
                    color={
                      license.status === 'IN_USE' ? 'success' :
                      license.status === 'STOPPED' ? 'error' : 'info'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {license.activatedAt
                    ? format(new Date(license.activatedAt), 'PPP', { locale: ko })
                    : '-'}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {format(new Date(license.expiresAt), 'PPP', { locale: ko })}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {format(new Date(license.createdAt), 'PPP', { locale: ko })}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Switch
                    checked={license.isActive}
                    onChange={() => handleToggleActive(license.id, license.isActive)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
      <LicenseFormModal
        open={isSingleModalOpen}
        onClose={() => setIsSingleModalOpen(false)}
        onSubmit={handleSingleAdd}
      />
      <BulkLicenseModal
        open={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkAdd}
      />
      <ImportLicenseModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
      <BulkDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleBulkDelete}
      />
    </Card>
  );
}