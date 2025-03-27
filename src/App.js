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
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 模擬專案數據
const initialProjects = [
  {
    id: 1,
    name: '專案一',
    description: '這是一個示例專案，展示了專案的基本信息。',
    department: '研發部',
    employeeId: 'EMP001',
  },
  {
    id: 2,
    name: '專案二',
    description: '另一個示例專案，用於展示不同的專案內容。',
    department: '設計部',
    employeeId: 'EMP002',
  },
];

function ProjectList({ projects, onEditProject, onDeleteProject }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
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
    onEditProject({
      id: projects.length + 1,
      ...formData
    });
    handleClose();
    setFormData({
      name: '',
      description: '',
      department: '',
      employeeId: '',
    });
  };

  const handleMenuClick = (event, project) => {
    event.stopPropagation(); // 防止事件冒泡
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProject) {
      onDeleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      handleMenuClose();
    }
  };

  const ProjectCard = ({ project, isAddNew = false }) => (
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
            }}
            onClick={handleOpen}
          >
            <AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="div">
              新增專案
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography gutterBottom variant="h5" component="div">
                {project.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, project)}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {project.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              部門：{project.department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              工號：{project.employeeId}
            </Typography>
          </>
        )}
      </CardContent>
      {!isAddNew && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/project/${project.id}`)}
          >
            修改專案
          </Button>
        </CardActions>
      )}
    </Card>
  );

  return (
    <>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <ProjectCard isAddNew />
          </Grid>
          {projects.map((project) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>新增專案</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="專案名稱"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            新增
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 180,
            boxShadow: 3,
          }
        }}
      >
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
          刪除專案
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography>
            確定要刪除專案 "{selectedProject?.name}" 嗎？此操作無法復原。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            刪除
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
                  onEditProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
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