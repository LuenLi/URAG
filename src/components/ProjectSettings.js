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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

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
  const [collections, setCollections] = useState(mockCollections);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%', p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Typography variant="h5" component="h1">
            {id === 'new' ? '新增專案' : '編輯專案'}
          </Typography>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本訊息設定
              </Typography>
            </Grid>
            
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
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  儲存基本訊息設定
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {id !== 'new' && (
        <Paper sx={{ width: '100%', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Collection 列表
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/project/${id}/collection/new`)}
            >
              新增 Collection
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Collection Name</TableCell>
                  <TableCell>Embedding Pipeline</TableCell>
                  <TableCell>Retrieval Pipeline</TableCell>
                  <TableCell>Embedding Status</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>{collection.name}</TableCell>
                    <TableCell>{collection.embeddingPipeline}</TableCell>
                    <TableCell>{collection.retrievalPipeline}</TableCell>
                    <TableCell>
                      <Chip
                        label={collection.status}
                        color={collection.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditCollection(collection.id)}
                      >
                        編輯
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}

export default ProjectSettings; 