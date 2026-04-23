import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, Alert, IconButton } from '@mui/material';
import { CheckCircle, Settings, Close } from '@mui/icons-material';

const CredentialsStatus: React.FC = () => {
  const [credentials, setCredentials] = useState({ projectId: '', apiKey: '' });
  const [hasCredentials, setHasCredentials] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Não dependemos mais do Appwrite, sempre mostrar como configurado
    setCredentials({ projectId: 'wasabi', apiKey: 'configured' });
    setHasCredentials(true);
  }, []);

  // Atalho secreto: Ctrl + Alt + C para exibir por 10s
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'c' || e.key === 'C')) {
        setVisible(true);
        // auto esconder após 10s
        window.setTimeout(() => setVisible(false), 10000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClearCredentials = () => {
    if (confirm('Tem certeza que deseja limpar as credenciais?')) {
      // Limpar configurações do localStorage
      localStorage.removeItem('wasabi-config');
      setCredentials({ projectId: '', apiKey: '' });
      setHasCredentials(false);
    }
  };

  // Nunca mostrar automaticamente em produção para clientes
  if (!visible) return null;

  if (!hasCredentials) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}
        action={
          <IconButton size="small" onClick={() => setVisible(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Typography variant="body2">
          <strong>Credenciais não configuradas:</strong> Use o botão de configuração para definir o Access Key e Secret Key do Wasabi.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ position: 'relative', mb: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
      <IconButton 
        aria-label="fechar"
        size="small"
        onClick={() => setVisible(false)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <Close fontSize="small" />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
          Credenciais Configuradas
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 100 }}>
            Project ID:
          </Typography>
          <Chip 
            label={credentials.projectId} 
            size="small" 
            sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 100 }}>
            API Key:
          </Typography>
          <Chip 
            label={`${credentials.apiKey.substring(0, 8)}...`} 
            size="small" 
            sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Settings />}
          onClick={handleClearCredentials}
          sx={{ 
            borderColor: '#FF9800', 
            color: '#FF9800',
            '&:hover': { 
              borderColor: '#F57C00',
              color: '#F57C00'
            }
          }}
        >
          Limpar Credenciais
        </Button>
        
        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.6)', alignSelf: 'center' }}>
          💡 Dica: Use Ctrl + Alt + S no footer para configuração secreta
        </Typography>
      </Box>
    </Box>
  );
};

export default CredentialsStatus;
