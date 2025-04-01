import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

function UserManagement({ users, onUpdateUsers }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();

  // 當users改變時重置頁碼
  React.useEffect(() => {
    setPage(1);
  }, [users]);

  const handleAddUser = () => {
    onUpdateUsers([...users, newUser]);
    setOpenDialog(false);
    setNewUser({
      username: '',
      password: '',
      role: 'user'
    });
    setPage(1);
  };

  const handleDeleteUser = (username) => {
    onUpdateUsers(users.filter(user => user.username !== username));
    setPage(1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 計算總頁數
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  
  // 計算當前頁的用戶
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredUsers.length);
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 1,
            }}
          >
            帳號管理
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
            }}
          >
            管理系統使用者帳號與權限
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              },
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease-in-out',
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            新增使用者
          </Button>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: '#1976d2',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="搜尋使用者名稱"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              transition: 'all 0.3s ease-in-out',
              '&:focus-within': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              transition: 'all 0.3s ease-in-out',
              '&.Mui-focused': {
                color: '#1976d2',
              },
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>權限篩選</InputLabel>
          <Select
            value={roleFilter}
            label="權限篩選"
            onChange={handleRoleFilterChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                '&:hover': {
                  borderColor: '#1976d2',
                },
              },
              transition: 'all 0.3s ease-in-out',
              '&:focus-within': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="admin">管理者</MenuItem>
            <MenuItem value="user">一般使用者</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              fontSize: '1rem',
              py: 2,
              px: 3,
              borderBottom: '2px solid #e0e0e0',
            }}>
              使用者名稱
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              fontSize: '1rem',
              py: 2,
              px: 3,
              borderBottom: '2px solid #e0e0e0',
            }}>
              權限
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              fontSize: '1rem',
              py: 2,
              px: 3,
              borderBottom: '2px solid #e0e0e0',
            }}>
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageUsers.map((user) => (
            <TableRow 
              key={user.username}
              sx={{
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                },
                '& td': {
                  py: 2,
                  px: 3,
                  fontSize: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                }
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ color: '#1976d2', fontSize: 18 }} />
                  </Box>
                  {user.username}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={user.role === 'admin' ? '管理者' : '一般使用者'}
                  color={user.role === 'admin' ? 'primary' : 'default'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    '&.MuiChip-colorPrimary': {
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                      color: 'white',
                    },
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="error"
                  onClick={() => handleDeleteUser(user.username)}
                  disabled={user.username === 'admin'}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          size="large"
          sx={{
            '& .MuiPaginationItem-root': {
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                },
              },
            },
          }}
        />
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            animation: 'slideUp 0.3s ease-out',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonIcon sx={{ color: '#1976d2', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}>
              新增使用者
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請填寫新使用者的資訊
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="使用者名稱"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  transition: 'all 0.3s ease-in-out',
                  '&:focus-within': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  transition: 'all 0.3s ease-in-out',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
            />
            <TextField
              label="密碼"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  transition: 'all 0.3s ease-in-out',
                  '&:focus-within': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  transition: 'all 0.3s ease-in-out',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel>權限</InputLabel>
              <Select
                value={newUser.role}
                label="權限"
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                sx={{
                  height: 56,
                  '& .MuiOutlinedInput-notchedOutline': {
                    '&:hover': {
                      borderColor: '#1976d2',
                    },
                  },
                  transition: 'all 0.3s ease-in-out',
                  '&:focus-within': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                  },
                }}
              >
                <MenuItem value="user">一般使用者</MenuItem>
                <MenuItem value="admin">管理者</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={!newUser.username || !newUser.password}
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              },
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease-in-out',
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            新增
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserManagement; 