import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

interface BulkLicenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { programName: string; clientIdPrefix: string; count: number; expiresAt: Date }) => void;
}

export default function BulkLicenseModal({ open, onClose, onSubmit }: BulkLicenseModalProps) {
  const [programName, setProgramName] = useState('');
  const [clientIdPrefix, setClientIdPrefix] = useState('');
  const [count, setCount] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (!programName || !clientIdPrefix || !count || !expiresAt) return;

    onSubmit({
      programName,
      clientIdPrefix,
      count: parseInt(count, 10),
      expiresAt
    });

    setProgramName('');
    setClientIdPrefix('');
    setCount('');
    setExpiresAt(null);
  };

  const handleClose = () => {
    setProgramName('');
    setClientIdPrefix('');
    setCount('');
    setExpiresAt(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>라이선스 일괄 추가</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="info">
            지정한 개수만큼 라이선스가 자동으로 생성됩니다.
            클라이언트 ID는 자력한 접두사에 일련번호가 붙어 생성됩니다.
          </Alert>
          <TextField
            label="프로그램 이름"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="클라이언트 ID 접두사"
            value={clientIdPrefix}
            onChange={(e) => setClientIdPrefix(e.target.value)}
            helperText="예: CLIENT_ (뒤에 자동으로 일련번호가 붙습니다)"
            fullWidth
            required
          />
          <TextField
            label="생성 개수"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            fullWidth
            required
          />
          <DatePicker
            label="만료일"
            value={expiresAt}
            onChange={(newValue) => setExpiresAt(newValue)}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true
              }
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!programName || !clientIdPrefix || !count || !expiresAt}
        >
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
}