import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import StorageIcon from '@mui/icons-material/Storage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`collection-tabpanel-${index}`}
      aria-labelledby={`collection-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function CollectionSettings() {
  const { projectId, collectionId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    dbVendor: '',
    denseVectorDims: '',
    capacityLimit: '',
    currentCapacity: '',
    embeddingPipeline: '',
    retrievalPipeline: '',
    endpointApi: '',
    metadata: '',
    question: '',
    answer: '',
  });

  const [files, setFiles] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: 'Collection 1',
      dbVendor: 'Milvus',
      denseVectorDims: '768',
      capacityLimit: '1000000',
      currentCapacity: '500000',
    },
    {
      id: 2,
      name: 'Collection 2',
      dbVendor: 'Weaviate',
      denseVectorDims: '768',
      capacityLimit: '2000000',
      currentCapacity: '1000000',
    },
  ]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  useEffect(() => {
    // 判斷是否為編輯模式
    setIsEditMode(collectionId && collectionId !== 'new');
    
    // 如果是編輯模式，載入現有數據
    if (isEditMode) {
      // 模擬從API載入數據
      const mockData = {
        name: 'Collection 1',
        dbVendor: 'Milvus',
        denseVectorDims: '768',
        capacityLimit: '1000000',
        currentCapacity: '500000',
        embeddingPipeline: 'naive',
        retrievalPipeline: 'naive',
        endpointApi: 'http://localhost:8000/api',
        metadata: 'source\ndate\ncategory',
        question: '',
        answer: '',
      };
      setFormData(mockData);
    }
  }, [collectionId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleEmbedding = () => {
    // TODO: 處理Embedding邏輯
    console.log('Starting embedding process with:', {
      pipeline: formData.embeddingPipeline,
      files: files,
      metadata: formData.metadata
    });
  };

  const handleAddQA = () => {
    if (formData.question && formData.answer) {
      setQaList(prev => [...prev, {
        id: Date.now(),
        question: formData.question,
        answer: formData.answer
      }]);
      setFormData(prev => ({
        ...prev,
        question: '',
        answer: ''
      }));
    }
  };

  const handleRemoveQA = (id) => {
    setQaList(prev => prev.filter(qa => qa.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 根據模式執行不同的操作
    if (isEditMode) {
      // 更新現有 Collection
      console.log('Updating collection:', {
        id: collectionId,
        ...formData
      });
      // TODO: 調用更新 API
    } else {
      // 創建新的 Collection
      console.log('Creating new collection:', formData);
      // TODO: 調用創建 API
    }
    navigate(`/project/${projectId}`);
  };

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // 從列表中移除選中的 Collection
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          borderRadius: '8px 8px 0 0'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {isEditMode ? '編輯 Collection' : '新增 Collection'}
          </Typography>
          <IconButton 
            onClick={() => navigate(`/project/${projectId}`)}
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

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              minWidth: 120,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600
              }
            }
          }}
        >
          <Tab 
            label="建立 Database" 
            icon={<StorageIcon sx={{ mb: 0.5 }} />}
            iconPosition="top"
          />
          <Tab 
            label="Embedding Pipeline" 
            icon={<AutoAwesomeIcon sx={{ mb: 0.5 }} />}
            iconPosition="top"
          />
          <Tab 
            label="Retrieval Pipeline" 
            icon={<SearchIcon sx={{ mb: 0.5 }} />}
            iconPosition="top"
          />
          <Tab 
            label="QA" 
            icon={<QuestionAnswerIcon sx={{ mb: 0.5 }} />}
            iconPosition="top"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <StorageIcon /> Database 設定
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Collection Name"
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
                <FormControl fullWidth required>
                  <InputLabel>DB Vendor</InputLabel>
                  <Select
                    name="dbVendor"
                    value={formData.dbVendor}
                    label="DB Vendor"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  >
                    <MenuItem value="Milvus">Milvus</MenuItem>
                    <MenuItem value="Weaviate">Weaviate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  label="Dense Vector Dims"
                  name="denseVectorDims"
                  type="number"
                  value={formData.denseVectorDims}
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

              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  label="Capacity Limit"
                  name="capacityLimit"
                  type="number"
                  value={formData.capacityLimit}
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

              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  label="Current Capacity"
                  name="currentCapacity"
                  type="number"
                  value={formData.currentCapacity}
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
                    sx={{
                      px: 4,
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
                    {isEditMode ? '更新' : '儲存'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AutoAwesomeIcon /> Embedding Pipeline 設定
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Embedding Pipeline</InputLabel>
                  <Select
                    name="embeddingPipeline"
                    value={formData.embeddingPipeline}
                    label="Embedding Pipeline"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  >
                    <MenuItem value="naive">Naive RAG</MenuItem>
                    <MenuItem value="advanced">Advanced RAG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 2
                  }}>
                    文件管理
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        flex: 1, 
                        p: 2, 
                        minHeight: '200px',
                        maxHeight: '300px',
                        overflow: 'auto',
                        borderRadius: 2
                      }}
                    >
                      {files.length === 0 ? (
                        <Box sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary'
                        }}>
                          <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="body1">
                            尚未選擇任何文件
                          </Typography>
                        </Box>
                      ) : (
                        files.map((file, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              mb: 1,
                              p: 1.5,
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <InsertDriveFileIcon color="primary" />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {file.name}
                              </Typography>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveFile(index)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: 'error.lighter'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </Paper>
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          height: '56px', 
                          minWidth: '120px',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        選擇文件
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Metadata 欄位"
                  name="metadata"
                  multiline
                  rows={4}
                  value={formData.metadata}
                  onChange={handleChange}
                  placeholder="請輸入Metadata欄位，每行一個"
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
                    variant="contained"
                    color="primary"
                    onClick={handleEmbedding}
                    startIcon={<PlayArrowIcon />}
                    sx={{ 
                      minWidth: '120px',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    開始 Embedding
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SearchIcon /> Retrieval Pipeline 設定
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Retrieval Pipeline</InputLabel>
                  <Select
                    name="retrievalPipeline"
                    value={formData.retrievalPipeline}
                    label="Retrieval Pipeline"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  >
                    <MenuItem value="naive">Naive RAG</MenuItem>
                    <MenuItem value="advanced">Advanced RAG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Endpoint API"
                  name="endpointApi"
                  value={formData.endpointApi}
                  onChange={handleChange}
                  placeholder="請輸入 Endpoint API"
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
                    sx={{
                      px: 4,
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
                    {isEditMode ? '更新' : '儲存'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <QuestionAnswerIcon /> QA 設定
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 2
                  }}>
                    新增 QA
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      required
                      fullWidth
                      label="問題"
                      name="question"
                      multiline
                      rows={6}
                      value={formData.question}
                      onChange={handleChange}
                      placeholder="請輸入問題"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <TextField
                      required
                      fullWidth
                      label="答案"
                      name="answer"
                      multiline
                      rows={6}
                      value={formData.answer}
                      onChange={handleChange}
                      placeholder="請輸入答案"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddQA}
                      disabled={!formData.question || !formData.answer}
                      startIcon={<AddIcon />}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      新增 QA
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 2
                  }}>
                    已設定的 QA
                  </Typography>
                  {qaList.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4,
                      color: 'text.secondary'
                    }}>
                      <QuestionAnswerIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="body1">
                        尚未新增任何 QA
                      </Typography>
                    </Box>
                  ) : (
                    qaList.map((qa) => (
                      <Box 
                        key={qa.id}
                        sx={{ 
                          mb: 3,
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                            問題：
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveQA(qa.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.lighter'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, pl: 2 }}>
                          {qa.question}
                        </Typography>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                          答案：
                        </Typography>
                        <Typography variant="body1" sx={{ pl: 2 }}>
                          {qa.answer}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      px: 4,
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
                    {isEditMode ? '更新' : '儲存'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* 刪除確認對話框 */}
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

export default CollectionSettings; 