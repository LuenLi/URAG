import { styled, keyframes } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Container,
  Paper,
} from '@mui/material';

// 動畫關鍵幀
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

// 主題配置
export const theme = {
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
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes fadeIn {
          ${fadeIn}
        }
        @keyframes slideUp {
          ${slideUp}
        }
        @keyframes pulse {
          ${pulse}
        }
      `,
    },
  },
};

// 樣式組件
export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
}));

export const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

export const ProjectDescription = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(2),
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 8,
  padding: '8px 24px',
  transition: 'all 0.2s ease-in-out',
  '&.MuiButton-contained': {
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(33, 150, 243, 0.3)',
      transform: 'translateY(-1px)',
    },
  },
  '&.MuiButton-outlined': {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
      transform: 'translateY(-1px)',
    },
  },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    overflow: 'hidden',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
}));

export const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
  background: 'linear-gradient(to right, rgba(33, 150, 243, 0.05), rgba(33, 150, 243, 0.1))',
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem',
    color: theme.palette.primary.main,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const FormField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'all 0.2s ease-in-out',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}20`,
    },
  },
  '& .MuiInputBase-multiline': {
    padding: theme.spacing(1),
  },
}));

export const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
}));

export const DeleteDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  paddingTop: theme.spacing(8),
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
}));

export const DeleteDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

export const DeleteButton = styled(ActionButton)(({ theme }) => ({
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      boxShadow: `0 6px 16px ${theme.palette.error.main}40`,
    },
  },
}));

// 登入相關樣式組件
export const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 1,
  },
}));

export const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 420,
  width: '100%',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
    zIndex: -1,
    filter: 'blur(8px)',
  },
}));

export const LoginTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease-in-out',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.3s ease-in-out',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px 14px',
  },
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
  color: 'white',
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
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
    transform: 'translateY(-1px)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
})); 