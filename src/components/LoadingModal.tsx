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
      maxWidth="md"
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
      <DialogContent sx={{ p: 6, textAlign: 'center', position: 'relative' }}>
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
          <Box sx={{ mb: 4 }}>
            <WarningIcon
              sx={{
                fontSize: isMobile ? 60 : 80,
                color: '#ffeb3b',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              }}
            />
          </Box>

          {/* Title */}
          <DialogTitle sx={{ p: 0, mb: 3 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
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
              🔞 VERIFICAÇÃO DE IDADE 🔞
            </Typography>
          </DialogTitle>

          {/* Age verification message */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: '#ffeb3b',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
              }}
            >
              CONTEÚDO ADULTO - APENAS PARA MAIORES DE 18 ANOS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}
            >
              Este site contém conteúdo exclusivo para adultos. Você deve ter pelo menos 18 anos de idade para acessar este conteúdo.
                </Typography>
              </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckIcon />}
              onClick={onConfirm}
                sx={{
                  background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  color: 'white',
                  fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.1rem',
                px: 4,
                py: 1.5,
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
              SIM, TENHO 18+ ANOS
            </Button>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<CancelIcon />}
              onClick={onReject}
                sx={{
                background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, #1565C0 90%)`,
                  color: 'white',
                  fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.1rem',
                px: 4,
                py: 1.5,
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
              NÃO, SOU MENOR DE IDADE
            </Button>
          </Box>

          {/* Warning text */}
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: 'rgba(255, 255, 255, 0.7)',
              fontStyle: 'italic',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
            }}
          >
            ⚠️ Ao confirmar, você declara ter 18 anos ou mais e aceita visualizar conteúdo adulto
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationModal;
