import type { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SpeedIcon from '@mui/icons-material/Speed';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ValueCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const About: FC = () => {
  const theme = useTheme();
  const { siteName } = useSiteConfig();

  const values: ValueCard[] = [
    {
      title: 'Privacy & Discretion',
      description: 'We prioritize your privacy. All transactions are discreet, and your personal information is protected with industry-standard encryption.',
      icon: <LockIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    },
    {
      title: 'Secure Payments',
      description: 'We use trusted payment processors (Stripe, PayPal) with PCI-DSS compliance. Your financial data is never stored on our servers.',
      icon: <SecurityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    },
    {
      title: 'Premium Quality',
      description: 'All content is carefully curated to ensure the highest quality viewing experience for our adult audience.',
      icon: <HighQualityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    },
    {
      title: 'Age Verified',
      description: 'We maintain strict compliance with age verification requirements. All models are verified to be 18+ at the time of production.',
      icon: <VerifiedUserIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    },
    {
      title: 'Fast Support',
      description: 'Our support team is available to assist you with any questions or technical issues you may encounter.',
      icon: <SupportAgentIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    },
    {
      title: 'Instant Access',
      description: 'Get immediate access to your purchased content with no delays. Enjoy unlimited viewing anytime, anywhere.',
      icon: <SpeedIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
    }
  ];

  return (
    <Box sx={{ py: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2
            }}
          >
            About {siteName}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8
            }}
          >
            We are a premium adult content platform dedicated to providing our users 
            with high-quality, exclusive videos in a secure and discreet environment.
          </Typography>
        </Box>

        {/* Mission Statement */}
        <Box 
          sx={{ 
            mb: 8, 
            p: 5,
            borderRadius: '16px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(211,47,47,0.12) 0%, rgba(142,36,170,0.12) 100%)'
              : 'linear-gradient(135deg, rgba(211,47,47,0.06) 0%, rgba(142,36,170,0.06) 100%)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 2 }}>
            At {siteName}, we believe in providing a safe, secure, and professional platform 
            for adults to access premium content. Our mission is to combine quality entertainment 
            with the highest standards of privacy, security, and customer service.
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
            We understand the importance of discretion and trust in the adult content industry. 
            That's why we've built our platform with state-of-the-art security measures and 
            partnered with the most reputable payment processors to ensure your peace of mind.
          </Typography>
        </Box>

        {/* Our Values */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 4,
              textAlign: 'center'
            }}
          >
            Our Commitment to You
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 12px rgba(0,0,0,0.3)' 
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(26,26,26,0.8)'
                      : 'rgba(255,255,255,0.9)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 24px rgba(0,0,0,0.4)' 
                        : '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box 
          sx={{ 
            mt: 8,
            p: 5,
            borderRadius: '16px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(15,15,15,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,252,0.9) 100%)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>
                100%
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                Secure Payments
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>
                24/7
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                Access Available
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>
                SSL
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                Encrypted Connection
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Legal Compliance */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 4,
            borderRadius: '12px',
            background: theme.palette.mode === 'dark'
              ? 'rgba(211,47,47,0.1)'
              : 'rgba(211,47,47,0.05)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(211,47,47,0.3)'
              : '1px solid rgba(211,47,47,0.2)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Legal Compliance
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            We are committed to full compliance with all applicable laws and regulations 
            regarding adult content distribution. All content on our platform complies with:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
            <li><Typography variant="body2">USC 2257 Record-Keeping Requirements</Typography></li>
            <li><Typography variant="body2">Age Verification Standards</Typography></li>
            <li><Typography variant="body2">GDPR Privacy Regulations</Typography></li>
            <li><Typography variant="body2">PCI-DSS Payment Security Standards</Typography></li>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;

