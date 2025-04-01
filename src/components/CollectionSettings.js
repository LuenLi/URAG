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
  Chip,
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

function CollectionSettings({ onUpdateCollections, collections }) {
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [metadataFields, setMetadataFields] = useState([]);
  const [newMetadataField, setNewMetadataField] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadataCheckResult, setMetadataCheckResult] = useState(null);
  const [metadataRecommendations, setMetadataRecommendations] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // 判斷是否為編輯模式
    setIsEditMode(collectionId && collectionId !== 'new');
    
    // 如果是編輯模式，載入現有數據
    if (isEditMode) {
      // 從父組件獲取當前Collection的數據
      const currentCollection = collections.find(c => c.id === parseInt(collectionId));
      if (currentCollection) {
        setFormData({
          name: currentCollection.name,
          dbVendor: currentCollection.dbVendor || '',
          denseVectorDims: currentCollection.denseVectorDims || '',
          capacityLimit: currentCollection.capacityLimit || '',
          currentCapacity: currentCollection.currentCapacity || '',
          embeddingPipeline: currentCollection.embeddingPipeline || '',
          retrievalPipeline: currentCollection.retrievalPipeline || '',
          endpointApi: currentCollection.endpointApi || '',
          metadata: currentCollection.metadata || '',
          question: '',
          answer: ''
        });
      }
    }
  }, [collectionId, collections]);

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
    // 更新 Collection 的 embeddingPipeline
    const updatedCollection = {
      id: parseInt(collectionId),
      embeddingPipeline: formData.embeddingPipeline || 'None'
    };
    // 更新父組件的 collections 狀態
    onUpdateCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === parseInt(collectionId)) {
          return {
            ...c,
            ...updatedCollection
          };
        }
        return c;
      });
    }, projectId);
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
      const updatedCollection = {
        id: parseInt(collectionId),
        name: formData.name,
        dbVendor: formData.dbVendor,
        denseVectorDims: formData.denseVectorDims,
        capacityLimit: formData.capacityLimit,
        currentCapacity: formData.currentCapacity,
        embeddingPipeline: formData.embeddingPipeline || 'None',
        retrievalPipeline: formData.retrievalPipeline || 'None',
        status: 'Active',
        endpointApi: formData.endpointApi,
        metadata: formData.metadata
      };
      // 更新父組件的 collections 狀態
      onUpdateCollections(prevCollections => {
        return prevCollections.map(c => {
          if (c.id === parseInt(collectionId)) {
            return {
              ...c,
              ...updatedCollection
            };
          }
          return c;
        });
      }, projectId);
    } else {
      // 創建新的 Collection
      const newCollection = {
        id: Date.now(),
        name: formData.name,
        embeddingPipeline: formData.embeddingPipeline || 'None',
        retrievalPipeline: formData.retrievalPipeline || 'None',
        status: 'Active',
        dbVendor: formData.dbVendor,
        denseVectorDims: formData.denseVectorDims,
        capacityLimit: formData.capacityLimit,
        currentCapacity: formData.currentCapacity,
        endpointApi: formData.endpointApi,
        metadata: formData.metadata
      };
      // 更新父組件的 collections 狀態
      onUpdateCollections(prevCollections => {
        // 檢查是否已存在相同名稱的 Collection
        if (prevCollections.some(c => c.name === newCollection.name)) {
          alert('已存在相同名稱的 Collection');
          return prevCollections;
        }
        return [...prevCollections, newCollection];
      }, projectId);
    }
  };

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // 從列表中移除選中的 Collection
    onUpdateCollections(prevCollections => 
      prevCollections.filter(c => c.id !== collectionToDelete.id),
      projectId
    );
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleAddMetadataField = () => {
    if (newMetadataField.trim()) {
      setMetadataFields(prev => [...prev, newMetadataField.trim()]);
      setNewMetadataField('');
      // 更新 formData 中的 metadata
      setFormData(prev => ({
        ...prev,
        metadata: [...metadataFields, newMetadataField.trim()].join('\n')
      }));
    }
  };

  const handleRemoveMetadataField = (index) => {
    setMetadataFields(prev => prev.filter((_, i) => i !== index));
    // 更新 formData 中的 metadata
    setFormData(prev => ({
      ...prev,
      metadata: metadataFields.filter((_, i) => i !== index).join('\n')
    }));
  };

  const handleCheckMetadata = async () => {
    if (!selectedFile) {
      alert('請先選擇一個文件');
      return;
    }
    setIsChecking(true);
    // 模擬 API 調用
    setTimeout(() => {
      setMetadataCheckResult({
        file: selectedFile.name,
        results: metadataFields.map(field => ({
          field,
          exists: Math.random() > 0.5,
          value: Math.random() > 0.5 ? '示例值' : null
        }))
      });
      setIsChecking(false);
    }, 1500);
  };

  const handleRecommendMetadata = async () => {
    if (!selectedFile) {
      alert('請先選擇一個文件');
      return;
    }
    setIsRecommending(true);
    // 模擬 API 調用
    setTimeout(() => {
      setMetadataRecommendations({
        file: selectedFile.name,
        recommendations: [
          '作者',
          '出版日期',
          '主題',
          '關鍵字',
          '文件類型'
        ]
      });
      setIsRecommending(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        content: chatInput,
        type: 'user'
      }]);
      setChatInput('');
      // 處理聊天機器人回應
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          content: '這是聊天機器人的回應',
          type: 'assistant',
          sources: ['來源1', '來源2']
        }]);
      }, 1000);
    }
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
                    Metadata 欄位管理
                  </Typography>
                  
                  {/* Metadata 欄位列表 */}
                  <Box sx={{ mb: 3 }}>
                    {metadataFields.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        尚未新增任何 Metadata 欄位
                      </Typography>
                    ) : (
                      metadataFields.map((field, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
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
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {field}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveMetadataField(index)}
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
                  </Box>

                  {/* 新增 Metadata 欄位 */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="新增 Metadata 欄位"
                      value={newMetadataField}
                      onChange={(e) => setNewMetadataField(e.target.value)}
                      placeholder="請輸入 Metadata 欄位名稱"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddMetadataField}
                      disabled={!newMetadataField.trim()}
                      startIcon={<AddIcon />}
                      sx={{ 
                        minWidth: '120px',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      新增
                    </Button>
                  </Box>

                  {/* Metadata 檢查和推薦區域 */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      文件 Metadata 分析
                    </Typography>
                    
                    {/* 文件選擇 */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>選擇文件</InputLabel>
                      <Select
                        value={selectedFile ? selectedFile.name : ''}
                        onChange={(e) => setSelectedFile(files.find(f => f.name === e.target.value))}
                        label="選擇文件"
                      >
                        {files.map((file, index) => (
                          <MenuItem key={index} value={file.name}>
                            {file.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* 操作按鈕 */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCheckMetadata}
                        disabled={!selectedFile || isChecking}
                        startIcon={<SearchIcon />}
                        sx={{ 
                          minWidth: '200px',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {isChecking ? '檢查中...' : '檢查 Metadata'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleRecommendMetadata}
                        disabled={!selectedFile || isRecommending}
                        startIcon={<AutoAwesomeIcon />}
                        sx={{ 
                          minWidth: '200px',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {isRecommending ? '推薦中...' : '推薦 Metadata'}
                      </Button>
                    </Box>

                    {/* 檢查結果 */}
                    {metadataCheckResult && (
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          檢查結果：{metadataCheckResult.file}
                        </Typography>
                        {metadataCheckResult.results.map((result, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              mb: 1
                            }}
                          >
                            <Typography variant="body2" sx={{ minWidth: 120 }}>
                              {result.field}:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={result.exists ? 'success.main' : 'error.main'}
                            >
                              {result.exists ? result.value : '不存在'}
                            </Typography>
                          </Box>
                        ))}
                      </Paper>
                    )}

                    {/* 推薦結果 */}
                    {metadataRecommendations && (
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          推薦結果：{metadataRecommendations.file}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {metadataRecommendations.recommendations.map((rec, index) => (
                            <Chip
                              key={index}
                              label={rec}
                              color="primary"
                              variant="outlined"
                              onClick={() => {
                                setNewMetadataField(rec);
                                handleAddMetadataField();
                              }}
                              sx={{ 
                                '&:hover': {
                                  bgcolor: 'primary.lighter'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Paper>
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
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
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  height: 'calc(100vh - 300px)',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  position: 'sticky',
                  top: 20
                }}
              >
                <Box sx={{ 
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  borderRadius: '8px 8px 0 0'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SearchIcon /> Retriever 測試
                  </Typography>
                </Box>

                <Box sx={{ 
                  flex: 1,
                  p: 2,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minHeight: 0
                }}>
                  {/* 聊天訊息列表 */}
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {chatMessages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                          mb: 2
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '80%',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: message.type === 'user' ? 'primary.main' : 'background.paper',
                            color: message.type === 'user' ? 'white' : 'text.primary',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            position: 'relative'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          {message.type === 'assistant' && message.sources && (
                            <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                              <Typography variant="caption" color="text.secondary">
                                來源：
                              </Typography>
                              {message.sources.map((source, idx) => (
                                <Typography 
                                  key={idx} 
                                  variant="caption" 
                                  color="primary"
                                  sx={{ display: 'block' }}
                                >
                                  {source}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* 輸入區域 */}
                  <Box sx={{ 
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="輸入您的問題..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim()}
                        sx={{
                          minWidth: '100px',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        發送
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
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