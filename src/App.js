import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProjectSettings from './components/ProjectSettings';
import CollectionSettings from './components/CollectionSettings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
        },
      },
    },
  },
});

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

function ProjectCard({ project, isAddNew, onAddNew, onDelete }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(project.id);
    setOpenDeleteDialog(false);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {isAddNew ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              p: 3,
              textAlign: 'center',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={onAddNew}
          >
            <AddIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6">新增專案</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 1
              }}>
                {project.name}
              </Typography>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 2
              }}
            >
              {project.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${project.collections?.length || 0} Collections`}
                size="small"
                sx={{ 
                  bgcolor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.main'
                  }
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
      {!isAddNew && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            size="small" 
            onClick={() => navigate(`/project/${project.id}`)}
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white'
              }
            }}
          >
            查看詳情
          </Button>
        </CardActions>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1 }} /> 刪除
        </MenuItem>
      </Menu>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography>
            確定要刪除專案 "{project?.name || '未知專案'}" 嗎？此操作無法復原。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function ProjectList({ projects, onDeleteProject, onAddProject }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    employeeId: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      department: '',
      employeeId: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onAddProject({
      id: projects.length + 1,
      ...formData,
      collections: []
    });
    handleClose();
  };

  return (
    <>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <ProjectCard isAddNew onAddNew={handleOpen} />
          </Grid>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} onDelete={onDeleteProject} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          pb: 1,
          color: 'primary.main',
          fontWeight: 600
        }}>
          新增專案
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="專案名稱"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="部門"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="工號"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="專案簡介"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            新增
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function App() {
  const [projects, setProjects] = useState(initialProjects);

  const handleUpdateProject = (updatedProject) => {
    setProjects(prevProjects => {
      const existingProject = prevProjects.find(p => p.id === updatedProject.id);
      if (existingProject) {
        // 更新現有專案
        return prevProjects.map(project =>
          project.id === updatedProject.id
            ? updatedProject
            : project
        );
      } else {
        // 新增專案
        return [...prevProjects, updatedProject];
      }
    });
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URAG
              </Typography>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route
              path="/"
              element={
                <ProjectList
                  projects={projects}
                  onDeleteProject={handleDeleteProject}
                  onAddProject={handleUpdateProject}
                />
              }
            />
            <Route
              path="/project/:id"
              element={
                <ProjectSettings
                  projects={projects}
                  onUpdateProject={handleUpdateProject}
                />
              }
            />
            <Route
              path="/project/:projectId/collection/:collectionId"
              element={<CollectionSettings />}
            />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 