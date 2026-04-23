import type { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useSiteConfig } from '../context/SiteConfigContext';

const ContactSection: FC = () => {
  const { telegramUsername } = useSiteConfig();

  const handleTelegramClick = () => {
    if (telegramUsername) {
      const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}`;
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Paper 
          elevation={2} 
          sx={(theme) => ({ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            color: theme.palette.getContrastText(theme.palette.primary.main)
          })}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            For more VIP content or all content
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Get in touch with us for exclusive access to premium videos and complete content library. Your privacy is our priority.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<TelegramIcon />}
            onClick={handleTelegramClick}
            sx={(theme) => ({
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: theme => `0 8px 25px ${theme.palette.mode === 'dark' ? 'rgba(13, 71, 161, 0.25)' : 'rgba(13, 71, 161, 0.18)'}`,
              '&:hover': {
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            })}
          >
            Contact via Telegram
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactSection;
