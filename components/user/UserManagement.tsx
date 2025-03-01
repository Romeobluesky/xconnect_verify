import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Search';
import { useState, useEffect, useCallback } from 'react';
import UserFormModal from '@/components/user/UserFormModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import EditUserModal from './EditUserModal';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSession } from 'next-auth/react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/users?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalCount(data.total);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAddUser = async (data: { email: string; name: string; password: string; role: 'SUPER_ADMIN' | 'ADMIN' }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('사용자 추가 실패');

      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('사용자 추가 실패:', error);
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    fetchUsers();
  };

  const handleEditUser = async (data: { name: string; role: 'SUPER_ADMIN' | 'ADMIN' }) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('사용자 수정 실패');

      fetchUsers();
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('사용자 수정 실패:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '삭제 실패');
      }

      fetchUsers();
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="이메일 또는 이름으로 검색"
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
              <Button
                startIcon={<RefreshIcon />}
                variant="outlined"
                size="small"
                sx={{ height: 40 }}
                onClick={handleRefresh}
              >
                새로고침
              </Button>
            </Stack>
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              size="small"
              sx={{ height: 40 }}
            >
              사용자 추가
            </Button>
          </Stack>
        </Box>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>이메일</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>이름</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>권한</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>생성일</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow hover key={user.id}>
                  <TableCell style={{ textAlign: 'center' }}>{user.email}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{user.name}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{user.role === 'SUPER_ADMIN' ? '최고관리자' : '관리자'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {format(new Date(user.createdAt), 'PPP', { locale: ko })}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ height: 24 }}
                        onClick={() => {
                          setSelectedUser(user);
                          setEditModalOpen(true);
                        }}
                        startIcon={<EditIcon />}
                      >
                        수정
                      </Button>
                      {isSuperAdmin && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ height: 24 }}
                          onClick={() => handleDeleteUser(user.id)}
                          startIcon={<DeleteIcon />}
                          disabled={user.role === 'SUPER_ADMIN'}
                        >
                          삭제
                        </Button>
                      )}
                    </Stack>
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
      </Card>
      <UserFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
          initialData={{
            name: selectedUser.name,
            role: selectedUser.role,
          }}
        />
      )}
    </>
  );
}