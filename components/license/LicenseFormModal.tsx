import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

interface LicenseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { programName: string; clientId: string; expiresAt: Date }) => void;
}

export default function LicenseFormModal({ open, onClose, onSubmit }: LicenseFormModalProps) {
  const [programName, setProgramName] = useState('');
  const [clientId, setClientId] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (!programName || !clientId || !expiresAt) return;

    onSubmit({
      programName,
      clientId,
      expiresAt
    });

    setProgramName('');
    setClientId('');
    setExpiresAt(null);
  };

  const handleClose = () => {
    setProgramName('');
    setClientId('');
    setExpiresAt(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>라이선스 추가</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="프로그램 이름"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="클라이언트 ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
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
          disabled={!programName || !clientId || !expiresAt}
        >
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}