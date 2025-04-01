import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import {
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
} from '../styles/App.styles';

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
    <StyledCard>
      <StyledCardContent>
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
              <ProjectTitle variant="h6" component="h2">
                {project.name}
              </ProjectTitle>
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
            <ProjectDescription variant="body2" color="text.secondary">
              {project.description}
            </ProjectDescription>
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
      </StyledCardContent>
      {!isAddNew && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <ActionButton 
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
          </ActionButton>
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
            width: '100%',
          }
        }}
      >
        <DialogTitleStyled sx={{ color: 'error.main' }}>
          <DeleteIcon /> 確認刪除
        </DialogTitleStyled>
        <DeleteDialogContent>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              確定要刪除專案嗎？
            </Typography>
            <Typography variant="body1" color="text.secondary">
              專案名稱：{project?.name || '未知專案'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              此操作無法復原，請謹慎操作。
            </Typography>
          </Box>
        </DeleteDialogContent>
        <DeleteDialogActions>
          <ActionButton onClick={() => setOpenDeleteDialog(false)}>
            取消
          </ActionButton>
          <DeleteButton onClick={handleDeleteConfirm} variant="contained">
            確認刪除
          </DeleteButton>
        </DeleteDialogActions>
      </Dialog>
    </StyledCard>
  );
}

function ProjectList({ projects, onDeleteProject, onAddProject }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
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

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <SearchContainer>
          <Typography variant="body2" color="text.secondary">
            找到 {filteredProjects.length} 個專案
          </Typography>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="搜尋專案名稱..."
            value={searchKeyword}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
          />
        </SearchContainer>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <ProjectCard isAddNew onAddNew={handleOpen} />
          </Grid>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} onDelete={onDeleteProject} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitleStyled>
          <AddIcon /> 新增專案
        </DialogTitleStyled>
        <StyledDialogContent>
          <FormContainer>
            <FormField>
              <StyledTextField
                required
                fullWidth
                label="專案名稱"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="請輸入專案名稱"
              />
            </FormField>
            <FormField>
              <StyledTextField
                required
                fullWidth
                label="部門"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="請輸入部門名稱"
              />
            </FormField>
            <FormField>
              <StyledTextField
                required
                fullWidth
                label="工號"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="請輸入工號"
              />
            </FormField>
            <FormField>
              <StyledTextField
                required
                fullWidth
                label="專案簡介"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="請輸入專案簡介"
              />
            </FormField>
          </FormContainer>
        </StyledDialogContent>
        <DialogActionsStyled>
          <ActionButton onClick={handleClose}>
            取消
          </ActionButton>
          <ActionButton onClick={handleSubmit} variant="contained">
            新增
          </ActionButton>
        </DialogActionsStyled>
      </StyledDialog>
    </>
  );
}

export default ProjectList; 