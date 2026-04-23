import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import TelegramService from '../services/TelegramService';

const TelegramTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const success = await TelegramService.testConnection();
      setResult({
        success,
        message: success ? 'Bot conectado com sucesso!' : 'Falha na conexão com o bot'
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erro: ${error}`
      });
    } finally {
      setTesting(false);
    }
  };

  const testNotification = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const success = await TelegramService.sendSaleNotification({
        videoTitle: 'Teste de Notificação',
        videoPrice: 19.99,
        buyerEmail: 'teste@exemplo.com',
        buyerName: 'Usuário Teste',
        transactionId: 'TEST-' + Date.now(),
        paymentMethod: 'paypal',
        timestamp: new Date().toLocaleString('pt-BR')
      });
      
      setResult({
        success,
        message: success ? 'Notificação de teste enviada!' : 'Falha ao enviar notificação'
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erro: ${error}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Teste do Telegram Bot
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use estes botões para testar a conexão e envio de notificações do Telegram Bot.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={testConnection}
          disabled={testing}
          startIcon={testing ? <CircularProgress size={20} /> : null}
        >
          Testar Conexão
        </Button>
        
        <Button
          variant="outlined"
          onClick={testNotification}
          disabled={testing}
          startIcon={testing ? <CircularProgress size={20} /> : null}
        >
          Enviar Notificação de Teste
        </Button>
      </Box>

      {result && (
        <Alert severity={result.success ? 'success' : 'error'}>
          {result.message}
        </Alert>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        <strong>Nota:</strong> Certifique-se de configurar as credenciais do bot no arquivo 
        <code>src/config/telegram.ts</code> antes de testar.
      </Typography>
    </Box>
  );
};

export default TelegramTest;
