import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Grid,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogContent,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputLabel,
  FormControl,
  Select,
  DialogTitle,
  DialogActions,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import ProjectSettings from './components/ProjectSettings';
import CollectionSettings from './components/CollectionSettings';
import ProjectList from './components/ProjectList';
import { styled } from '@mui/material/styles';
import {
  theme,
  StyledCard,
  StyledCardContent,
  ProjectTitle,
  ProjectDescription,
  SearchContainer,
  StyledTextField,
  ActionButton,
  DialogTitleStyled,
  DialogActionsStyled,
  StyledDialog,
  StyledDialogContent,
  FormContainer,
  FormField,
  DeleteDialogContent,
  DeleteDialogActions,
  DeleteButton,
  LoginContainer,
  LoginPaper,
  LoginTextField,
  LoginButton,
} from './styles/App.styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import UserManagement from './components/UserManagement';

// 模擬專案數據
const initialProjects = [
  {
    id: 1,
    name: '專案一',
    description: '這是第一個專案的描述',
    collections: []
  },
  {
    id: 2,
    name: '專案二',
    description: '這是第二個專案的描述',
    collections: []
  },
];

// 模擬用戶數據
const initialUsers = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'user'
  }
];

// 受保護的路由組件
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

// 主應用組件
function MainApp({ projects, onDeleteProject, onAddProject, onLogout, username, userRole, users, onUpdateUsers, setProjects }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [collections, setCollections] = useState([]);

  const handleUpdateCollections = (updateFn, projectId) => {
    // 找到當前項目
    const currentProject = projects.find(p => p.id === parseInt(projectId));
    if (!currentProject) return;

    // 更新 collections 狀態
    setCollections(prevCollections => {
      const updatedCollections = updateFn(prevCollections);
      // 更新項目數據
      const updatedProjects = projects.map(project => {
        if (project.id === parseInt(projectId)) {
          return {
            ...project,
            collections: updatedCollections
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      return updatedCollections;
    });
  };

  // 當切換項目時更新 collections
  useEffect(() => {
    if (projectId) {
      const currentProject = projects.find(p => p.id === parseInt(projectId));
      if (currentProject) {
        setCollections(currentProject.collections || []);
      }
    }
  }, [projectId, projects]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2, #2196f3)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URAG
          </Typography>
          {userRole === 'admin' && (
            <Button
              color="inherit"
              onClick={() => navigate('/user-management')}
              sx={{
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              帳號管理
            </Button>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {username}
            </Typography>
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<ProjectList projects={projects} onDeleteProject={onDeleteProject} onAddProject={onAddProject} />} />
        {userRole === 'admin' && (
          <Route
            path="/user-management"
            element={<UserManagement users={users} onUpdateUsers={onUpdateUsers} />}
          />
        )}
        <Route
          path="/project/:id"
          element={<ProjectSettings projects={projects} onUpdateProject={onAddProject} />}
        />
        <Route
          path="/project/:projectId/collection/:collectionId"
          element={<CollectionSettings onUpdateCollections={handleUpdateCollections} />}
        />
      </Routes>
    </Box>
  );
}

// 登入組件
function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      onLogin(formData.username, formData.password);
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <LoginContainer>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          zIndex: 1,
        }}
      >
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
              animation: `float ${3 + index}s infinite ease-in-out`,
              animationDelay: `${index * 0.5}s`,
              position: 'absolute',
              top: `${20 + index * 15}%`,
              left: `${20 + index * 15}%`,
              backdropFilter: 'blur(5px)',
            }}
          />
        ))}
      </Box>
      <LoginPaper elevation={3}>
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
              position: 'relative',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                zIndex: -1,
                animation: 'pulse 2s infinite',
              },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <LockOutlinedIcon 
              sx={{ 
                fontSize: 44, 
                color: 'white',
                transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)',
                transition: 'transform 0.5s ease-in-out',
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              textAlign: 'center',
              mb: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: 3,
                background: 'linear-gradient(90deg, transparent, #2196f3, transparent)',
                borderRadius: 2,
              },
            }}
          >
            歡迎使用 URAG
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              maxWidth: '80%',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            請輸入您的帳號密碼以繼續使用系統
          </Typography>
        </Box>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            width: '100%',
            animation: 'slideUp 0.5s ease-in-out',
          }}
        >
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2, 
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease-in-out',
              }}
            >
              {error}
            </Typography>
          )}
          <LoginTextField
            required
            fullWidth
            label="使用者名稱"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="請輸入使用者名稱"
            autoFocus
            error={!!error}
            InputProps={{
              startAdornment: (
                <Box 
                  sx={{ 
                    mr: 1, 
                    color: 'text.secondary',
                    transform: formData.username ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  <PersonIcon />
                </Box>
              ),
            }}
          />
          <LoginTextField
            required
            fullWidth
            label="密碼"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="請輸入密碼"
            error={!!error}
            InputProps={{
              startAdornment: (
                <Box 
                  sx={{ 
                    mr: 1, 
                    color: 'text.secondary',
                    transform: formData.password ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  <LockIcon />
                </Box>
              ),
            }}
          />
          <LoginButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ 
              mt: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                transform: 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
              },
              '&:hover::before': {
                transform: 'translateX(100%)',
              },
            }}
          >
            登入系統
          </LoginButton>
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
}

function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [users, setUsers] = useState(initialUsers);

  const handleUpdateProject = (updatedProject) => {
    setProjects(prevProjects => {
      const existingProject = prevProjects.find(p => p.id === updatedProject.id);
      if (existingProject) {
        return prevProjects.map(project =>
          project.id === updatedProject.id
            ? updatedProject
            : project
        );
      } else {
        return [...prevProjects, updatedProject];
      }
    });
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setUsername(username);
      setUserRole(user.role);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserRole('');
  };

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainApp
                  projects={projects}
                  onDeleteProject={handleDeleteProject}
                  onAddProject={handleUpdateProject}
                  onLogout={handleLogout}
                  username={username}
                  userRole={userRole}
                  users={users}
                  onUpdateUsers={setUsers}
                  setProjects={setProjects}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 