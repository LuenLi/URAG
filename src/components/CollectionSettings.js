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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

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

  useEffect(() => {
    // 如果是編輯模式，載入現有數據
    if (collectionId && collectionId !== 'new') {
      // TODO: 從API或狀態管理載入Collection數據
      const mockData = {
        name: 'Collection 1',
        dbVendor: 'Milvus',
        denseVectorDims: '768',
        capacityLimit: '1000000',
        currentCapacity: '500000',
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
    // TODO: 處理表單提交
    console.log('Form submitted:', formData);
    navigate(`/project/${projectId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2
        }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="建立 Database" />
            <Tab label="Embedding Pipeline" />
            <Tab label="Retrieval Pipeline" />
            <Tab label="QA" />
          </Tabs>
          <IconButton 
            onClick={() => navigate(`/project/${projectId}`)}
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

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Database 設定
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Collection Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>DB Vendor</InputLabel>
                  <Select
                    name="dbVendor"
                    value={formData.dbVendor}
                    label="DB Vendor"
                    onChange={handleChange}
                  >
                    <MenuItem value="Milvus">Milvus</MenuItem>
                    <MenuItem value="Weaviate">Weaviate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Dense Vector Dims"
                  name="denseVectorDims"
                  type="number"
                  value={formData.denseVectorDims}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Capacity Limit"
                  name="capacityLimit"
                  type="number"
                  value={formData.capacityLimit}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Current Capacity"
                  name="currentCapacity"
                  type="number"
                  value={formData.currentCapacity}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/project/${projectId}`)}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    儲存
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
                <Typography variant="h6" gutterBottom>
                  Embedding Pipeline 設定
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
                  >
                    <MenuItem value="naive">Naive RAG</MenuItem>
                    <MenuItem value="advanced">Advanced RAG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      flex: 1, 
                      p: 2, 
                      minHeight: '200px',
                      maxHeight: '300px',
                      overflow: 'auto'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      已選擇的文件：
                    </Typography>
                    {files.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        尚未選擇任何文件
                      </Typography>
                    ) : (
                      files.map((file, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 1,
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" sx={{ flex: 1, mr: 2 }}>
                            {file.name}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveFile(index)}
                            sx={{ color: 'error.main' }}
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
                      sx={{ height: '56px', minWidth: '120px' }}
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
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/project/${projectId}`)}
                  >
                    取消
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEmbedding}
                    sx={{ minWidth: '120px' }}
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
                <Typography variant="h6" gutterBottom>
                  Retrieval Pipeline 設定
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
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    儲存
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
                <Typography variant="h6" gutterBottom>
                  QA 設定
                </Typography>
              </Grid>

              <Grid item xs={12}>
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
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddQA}
                    disabled={!formData.question || !formData.answer}
                  >
                    新增 QA
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    已設定的 QA：
                  </Typography>
                  {qaList.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      尚未新增任何 QA
                    </Typography>
                  ) : (
                    qaList.map((qa) => (
                      <Box 
                        key={qa.id}
                        sx={{ 
                          mb: 3,
                          p: 2,
                          bgcolor: 'background.default',
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" color="primary">
                            問題：
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveQA(qa.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {qa.question}
                        </Typography>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          答案：
                        </Typography>
                        <Typography variant="body1">
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
                  >
                    儲存
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default CollectionSettings; 