import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack
} from '@mui/material';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    name: string; 
    role: 'SUPER_ADMIN' | 'ADMIN';
    password?: string;
  }) => void;
  initialData: {
    name: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
  };
}

export default function EditUserModal({ open, onClose, onSubmit, initialData }: EditUserModalProps) {
  const [name, setName] = useState(initialData.name);
  const [role, setRole] = useState(initialData.role);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (password && password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다');
      return;
    }

    onSubmit({ 
      name, 
      role,
      ...(password ? { password } : {})
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>사용자 정보 수정</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              label="이름"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <TextField
              label="새 비밀번호"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              helperText="변경하지 않으려면 비워두세요"
            />
            {password && (
              <TextField
                label="비밀번호 확인"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                error={!!passwordError}
                helperText={passwordError}
                required
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained">수정</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
} 