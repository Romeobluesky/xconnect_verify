import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/admin/dashboard'
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <Typography variant="h4" align="center" gutterBottom>
                로그인
              </Typography>

              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

              <TextField
                label="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요."
                type="email"
                fullWidth
                required
              />

              <TextField
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="패스워드를 입력해주세요."
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                로그인
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}