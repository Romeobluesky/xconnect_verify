import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { useState } from 'react';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; name: string; password: string; role: 'SUPER_ADMIN' | 'ADMIN' }) => void;
}

export default function UserFormModal({ open, onClose, onSubmit }: UserFormModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN'>('ADMIN');

  const handleSubmit = () => {
    onSubmit({ email, name, password, role });
    setEmail('');
    setName('');
    setPassword('');
    setRole('ADMIN');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>사용자 추가</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            fullWidth
            required
          />
          <TextField
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>권한</InputLabel>
            <Select
              value={role}
              label="권한"
              onChange={(e) => setRole(e.target.value as 'SUPER_ADMIN' | 'ADMIN')}
            >
              <MenuItem value="ADMIN">관리자</MenuItem>
              <MenuItem value="SUPER_ADMIN">최고관리자</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!email || !name || !password}
        >
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}