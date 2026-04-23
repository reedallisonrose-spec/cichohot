import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { useSiteConfig } from '../context/SiteConfigContext';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import Divider from '@mui/material/Divider';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import HttpsIcon from '@mui/icons-material/Https';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const { siteName, telegramUsername } = useSiteConfig();
  const [showSecretButton, setShowSecretButton] = useState(false);
  const [credentials, setCredentials] = useState({ projectId: '', apiKey: '' });
  
  const handleBuyTemplate = () => {
    window.open('https://t.me/nlyadm21', '_blank');
  };

  // Detectar combinação de teclas para mostrar botão secreto (Ctrl + Alt + S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 's') {
        setShowSecretButton(true);
        // Esconder após 10 segundos
        setTimeout(() => setShowSecretButton(false), 10000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Carregar credenciais salvas
  useEffect(() => {
    // Não dependemos mais do Appwrite
    const saved = { projectId: '', apiKey: '' };
    setCredentials(saved);
  }, []);

  const handleSecretConfig = () => {
    const projectId = prompt('Digite o Access Key do Wasabi:');
    const apiKey = prompt('Digite a Secret Key do Wasabi:');
    
    if (projectId && apiKey) {
      // Não dependemos mais do Appwrite - salvar em localStorage
      localStorage.setItem('wasabi-config', JSON.stringify({ projectId, apiKey }));
      setCredentials({ projectId, apiKey });
      alert('Credenciais salvas com sucesso!');
    }
  };
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, rgba(3,9,37,0.96) 0%, rgba(2,6,23,0.99) 100%)'
          : 'linear-gradient(180deg, rgba(250,250,252,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        borderTop: theme.palette.mode === 'dark'
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(0,0,0,0.06)',
        color: theme.palette.mode === 'dark' ? '#fff' : '#111',
        mt: 4
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
                {siteName}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                Simple and secure access to your private video content.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                component={RouterLink}
                to="/" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink}
                to="/videos" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                Videos
              </Link>
              <Link 
                component={RouterLink}
                to="/about" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                About Us
              </Link>
              <Link 
                component={RouterLink}
                to="/faq" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                component={RouterLink}
                to="/terms" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                component={RouterLink}
                to="/privacy" 
                underline="hover" 
                sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    color: theme.palette.primary.main
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)', mb: 1 }}>
                USC 2257 Compliance
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {telegramUsername && (
                <Link 
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover" 
                  sx={{ 
                    mb: 1.5, 
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: '#0088cc'
                    }
                  }}
                >
                  <TelegramIcon sx={{ fontSize: 18 }} />
                  Contact Us
                </Link>
              )}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.palette.primary.main,
                  mt: 1,
                  background: theme.palette.mode === 'dark' ? 'rgba(142,36,170,0.1)' : 'rgba(211,47,47,0.06)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  width: 'fit-content'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  18+ ADULTS ONLY
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 2 }}>
              Security & Payments
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', mb: 1.5 }} paragraph>
              Payments are processed securely and discretely.
            </Typography>
          </Grid>
        </Grid>
        
        {/* Payment Methods */}
        <Box 
          sx={{ 
            mt: 4,
            mb: 3,
            p: 3,
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? 'rgba(26,26,26,0.5)' 
              : 'rgba(255,255,255,0.5)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, fontWeight: 600 }}>
            Secure Payment Methods Accepted
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
              💳 Stripe
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
              💰 PayPal
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
              🔒 SSL Secure
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
              ✓ PCI-DSS Compliant
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3, borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
            &copy; {currentYear} {siteName}. All rights reserved. Adults only (18+).
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
              🔒 Secure & Private
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
              • Discreet Billing
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
              • GDPR Compliant
            </Typography>
            
            {/* Botão secreto - aparece com Ctrl + Alt + S */}
            {showSecretButton && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<SettingsIcon />}
                onClick={handleSecretConfig}
                  sx={{ 
                  ml: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': { 
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main
                  }
                }}
              >
                Config
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
