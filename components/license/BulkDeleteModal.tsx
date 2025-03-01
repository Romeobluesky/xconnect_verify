import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';

interface BulkDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: (criteria: { programName?: string; status?: 'ISSUED' | 'IN_USE' }) => Promise<void>;
}

export default function BulkDeleteModal({ open, onClose, onDelete }: BulkDeleteModalProps) {
  const [programName, setProgramName] = useState('');
  const [status, setStatus] = useState<'ISSUED' | 'IN_USE' | ''>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [programs, setPrograms] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/licenses/programs');
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('프로그램 목록 조회 실패:', error);
      }
    };

    if (open) {
      fetchPrograms();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    const criteria: { programName?: string; status?: 'ISSUED' | 'IN_USE' } = {};
    if (programName) criteria.programName = programName;
    if (status) criteria.status = status;

    await onDelete(criteria);
    handleClose();
  };

  const handleClose = () => {
    setIsConfirming(false);
    setProgramName('');
    setStatus('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>라이선스 일괄 삭제</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {isConfirming ? (
            <Alert severity="warning">
              선택한 조건으로 라이선스를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </Alert>
          ) : (
            <>
              <Typography color="text.secondary">
                삭제할 라이선스의 조건을 선택해주세요.
                <br />
                조건을 선택하지 않으면 모든 라이선스가 삭제됩니다.
              </Typography>
              <FormControl fullWidth>
                <InputLabel>프로그램 이름</InputLabel>
                <Select
                  value={programName}
                  label="프로그램 이름"
                  onChange={(e) => setProgramName(e.target.value)}
                >
                  <MenuItem value="">전체</MenuItem>
                  {programs.map((program) => (
                    <MenuItem key={program} value={program}>
                      {program}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>상태</InputLabel>
                <Select
                  value={status}
                  label="상태"
                  onChange={(e) => setStatus(e.target.value as 'ISSUED' | 'IN_USE' | '')}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="ISSUED">발급됨</MenuItem>
                  <MenuItem value="IN_USE">사용중</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
        >
          {isConfirming ? '삭제 확인' : '삭제'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}