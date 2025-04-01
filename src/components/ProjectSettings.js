import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import CollectionsIcon from '@mui/icons-material/Collections';

// 模擬Collection數據
const mockCollections = [
  {
    id: 1,
    name: 'Collection 1',
    embeddingPipeline: 'Pipeline A',
    retrievalPipeline: 'Pipeline B',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Collection 2',
    embeddingPipeline: 'Pipeline C',
    retrievalPipeline: 'Pipeline D',
    status: 'Loading',
  },
];

function ProjectSettings({ projects, onUpdateProject }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    employeeId: '',
  });
  const [collections, setCollections] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const project = projects.find(p => p.id === parseInt(id));
      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
          department: project.department || '',
          employeeId: project.employeeId || '',
        });
        // 設置初始 collections
        setCollections(project.collections || []);
      }
    }
  }, [id, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === 'new') {
      onUpdateProject({
        id: projects.length + 1,
        ...formData
      });
    } else {
      onUpdateProject({
        id: parseInt(id),
        ...formData
      });
    }
  };

  const handleEditCollection = (collectionId) => {
    navigate(`/project/${id}/collection/${collectionId}`);
  };

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setCollections(prevCollections => 
      prevCollections.filter(c => c.id !== collectionToDelete.id)
    );
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  // 更新 collections 的函數
  const handleUpdateCollections = (newCollections) => {
    setCollections(newCollections);
    // 更新專案數據
    const updatedProject = {
      ...projects.find(p => p.id === parseInt(id)),
      collections: newCollections
    };
    onUpdateProject(updatedProject);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        sx={{ 
          width: '100%', 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" component="h1" sx={{ 
              fontWeight: 600,
              color: 'primary.main'
            }}>
              {id === 'new' ? '新增專案' : '編輯專案'}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'error.lighter'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <SettingsIcon color="primary" /> 基本訊息設定
              </Typography>
            </Grid>
            
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
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SettingsIcon />}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  儲存基本訊息設定
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {id !== 'new' && (
        <Paper 
          sx={{ 
            width: '100%', 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            pb: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CollectionsIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: 'primary.main'
              }}>
                Collection 列表
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/project/${id}/collection/new`)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              新增 Collection
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Collection Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Embedding Pipeline</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Retrieval Pipeline</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Embedding Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow 
                    key={collection.id}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>{collection.name}</TableCell>
                    <TableCell>{collection.embeddingPipeline}</TableCell>
                    <TableCell>{collection.retrievalPipeline}</TableCell>
                    <TableCell>
                      <Chip
                        label={collection.status}
                        color={collection.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/project/${id}/collection/${collection.id}`)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(collection)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          color: 'error.main',
          fontWeight: 600
        }}>
          確認刪除
        </DialogTitle>
        <DialogContent>
          <Typography>
            您確定要刪除 Collection "{collectionToDelete?.name}" 嗎？
            此操作無法復原。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            取消
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
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
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProjectSettings; 