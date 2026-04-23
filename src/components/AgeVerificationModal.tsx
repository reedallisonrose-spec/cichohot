import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface AgeVerificationModalProps {
  open: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ open, onConfirm, onReject }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      maxWidth={isMobile ? "sm" : "md"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1565C0 50%, #0D47A1 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        },
      }}
    >
      <DialogContent sx={{ p: isMobile ? 3 : 6, textAlign: 'center', position: 'relative' }}>
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Warning Icon */}
          <Box sx={{ mb: isMobile ? 2 : 4 }}>
            <WarningIcon
              sx={{
                fontSize: isMobile ? 40 : 80,
                color: '#ffeb3b',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              }}
            />
          </Box>

          {/* Title */}
          <DialogTitle sx={{ p: 0, mb: isMobile ? 2 : 3 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h3'}
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff 30%, #ffeb3b 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                letterSpacing: '0.05em',
              }}
            >
              🔞 AGE VERIFICATION 🔞
            </Typography>
          </DialogTitle>

          {/* Age verification message */}
          <Box
            sx={{
              mb: isMobile ? 2 : 4,
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 'bold',
                color: '#ffeb3b',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
              }}
            >
              ADULT CONTENT - 18+ ONLY
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: isMobile ? 2 : 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              startIcon={<CheckIcon />}
              onClick={onConfirm}
              sx={{
                background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                px: isMobile ? 2 : 4,
                py: isMobile ? 1 : 1.5,
                borderRadius: 3,
                boxShadow: '0 8px 16px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(76, 175, 80, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              YES, I AM 18+
            </Button>
            
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              startIcon={<CancelIcon />}
              onClick={onReject}
              sx={{
                background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, #1565C0 90%)`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                px: isMobile ? 2 : 4,
                py: isMobile ? 1 : 1.5,
                borderRadius: 3,
                boxShadow: '0 8px 16px rgba(244, 67, 54, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e53935 30%, #c62828 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(244, 67, 54, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              NO, UNDER 18
            </Button>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationModal;
