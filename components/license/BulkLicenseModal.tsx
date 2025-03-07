import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Typography,
  Box
} from '@mui/material';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface BulkLicenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Array<{
    programName: string;
    clientId: string;
    licenseKey: string;
    expiresAt: string;
    createdAt: string;
  }>) => Promise<void>;
}

export default function BulkLicenseModal({ open, onClose, onSubmit }: BulkLicenseModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const data = await readExcelFile(file);
      if (data.length === 0) {
        setError('유효한 데이터가 없습니다.');
        return;
      }
      
      await onSubmit(data);
      handleClose();
    } catch (err) {
      setError('파일 처리 중 오류가 발생했습니다: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const readExcelFile = async (file: File): Promise<Array<{
    programName: string;
    clientId: string;
    licenseKey: string;
    expiresAt: string;
    createdAt: string;
  }>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('파일을 읽을 수 없습니다.'));
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // 엑셀 데이터를 JSON으로 변환
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | null)[][];
          
          if (jsonData.length <= 1) {
            reject(new Error('데이터가 없거나 헤더만 있습니다.'));
            return;
          }
          
          // 헤더 확인 (첫 번째 행)
          const headers = jsonData[0];
          const expectedHeaders = ['프로그램', '업체명', '라이선스 키', '상태', '인증일', '만료일', '생성일'];
          
          // 헤더 검증
          const isHeaderValid = expectedHeaders.every(header => headers.includes(header));
          if (!isHeaderValid) {
            reject(new Error('엑셀 파일의 헤더가 올바르지 않습니다. 내보내기 형식과 동일해야 합니다.'));
            return;
          }
          
          // 데이터 추출 (헤더 제외)
          const result = jsonData.slice(1).map(row => {
            const today = format(new Date(), 'yyyy-MM-dd');
            
            return {
              programName: String(row[0] || ''),
              clientId: String(row[1] || ''),
              licenseKey: String(row[2] || ''),
              expiresAt: String(row[5] || today), // 만료일
              createdAt: String(row[6] || today)  // 생성일
            };
          }).filter(item => item.programName && item.clientId && item.licenseKey);
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>라이선스 일괄 추가</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="info">
            엑셀 파일을 업로드하여 라이선스를 일괄 추가합니다.
            엑셀 파일은 내보내기 기능의 형식과 동일해야 합니다.
            (프로그램명, 업체명, 라이선스키, 상태, 인증일, 만료일, 생성일)
          </Alert>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            fullWidth
          >
            엑셀 파일 선택
          </Button>
          
          {file && (
            <Typography variant="body2">
              선택된 파일: {file.name}
            </Typography>
          )}
          
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              참고사항:
            </Typography>
            <Typography variant="body2">
              - 상태는 자동으로 &quot;ISSUED&quot;로 설정됩니다.<br />
              - 인증일은 null로 설정됩니다.<br />
              - 만료일과 생성일은 년월일 형식(YYYY-MM-DD)으로 입력해야 합니다.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!file}
        >
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}