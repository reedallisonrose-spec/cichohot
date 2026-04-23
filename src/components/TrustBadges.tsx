import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import PaymentIcon from '@mui/icons-material/Payment';
import ShieldIcon from '@mui/icons-material/Shield';
import HttpsIcon from '@mui/icons-material/Https';

interface Badge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface TrustBadgesProps {
  variant?: 'default' | 'compact';
}

const TrustBadges: FC<TrustBadgesProps> = ({ variant = 'default' }) => {
  const theme = useTheme();

  const badges: Badge[] = [
    {
      icon: <HttpsIcon sx={{ fontSize: 40 }} />,
      title: 'SSL Encrypted',
      subtitle: '256-bit Security'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      subtitle: 'Stripe & PayPal'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Age Verified',
      subtitle: '18+ Content'
    },
    {
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      title: 'Discreet Billing',
      subtitle: 'Privacy Protected'
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40 }} />,
      title: 'GDPR Compliant',
      subtitle: 'Data Protection'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'PCI-DSS',
      subtitle: 'Payment Security'
    }
  ];

  if (variant === 'compact') {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          py: 2
        }}
      >
        {badges.slice(0, 4).map((badge, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark'
                ? 'rgba(15,23,42,0.7)'
                : 'rgba(226,239,255,0.8)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(129,140,248,0.4)'
                : '1px solid rgba(37,99,235,0.2)',
            }}
          >
            <Box sx={{ color: theme.palette.primary.main }}>
              {badge.icon}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {badge.title}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {badge.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography 
        variant="h5" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          mb: 4
        }}
      >
        Trusted & Secure Platform
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {badges.map((badge, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark'
                  ? 'rgba(15,23,42,0.85)'
                  : 'rgba(255,255,255,0.9)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 24px rgba(37,99,235,0.45)' 
                    : '0 8px 24px rgba(37,99,235,0.25)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <Box 
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 1
                }}
              >
                {badge.icon}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  mb: 0.5
                }}
              >
                {badge.title}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}
              >
                {badge.subtitle}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrustBadges;

