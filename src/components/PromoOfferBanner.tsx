import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useSiteConfig } from '../context/SiteConfigContext';
import { StripeService } from '../services/StripeService';
import { WhoService } from '../services/WhoService';

interface PromoOfferBannerProps {
  telegramLink?: string; // full URL override
  telegramUsername?: string; // e.g., mychannel or myuser
  prefilledMessage?: string; // custom interest message
}

const getRandomInt = (min: number, max: number) => {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const PromoOfferBanner = ({ telegramLink, telegramUsername, prefilledMessage }: PromoOfferBannerProps) => {
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isWhopLoading, setIsWhopLoading] = useState(false);
  const { stripePublishableKey, whoApiKey, loading: configLoading } = useSiteConfig();

  const interestMessage = prefilledMessage || "Hi! I'm interested in the $100 offer including all content. Could you guide me on how to pay?";
  const computedTelegramHref = (() => {
    try {
      if (telegramLink) return telegramLink;
      if (telegramUsername) {
        // Open chat with username and try to pass text
        return `https://t.me/${telegramUsername}?text=${encodeURIComponent(interestMessage)}`;
      }
      // Fallback: share with prefilled text (user selects chat)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `https://t.me/share/url?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(interestMessage)}`;
    } catch {
      return 'https://t.me/';
    }
  })();

  // Handle Stripe payment for $100 offer
  const handleStripePayment = async () => {
    try {
      setIsStripeLoading(true);
      
      // Initialize Stripe
      await StripeService.initStripe(stripePublishableKey);
      
      // Generate a random product name for privacy
      const productNames = [
        "Premium Content Package",
        "Digital Media Collection",
        "Exclusive Content Bundle",
        "Premium Access Package"
      ];
      const randomProductName = productNames[Math.floor(Math.random() * productNames.length)];
      
      // Build success and cancel URLs (usando HashRouter)
      const successUrl = `${window.location.origin}/#/payment-success?payment_method=stripe&offer_type=all_content&price=100`;
      const cancelUrl = 'https://www.google.com/';
      
      // Create checkout session
      const checkout = await StripeService.createCheckoutSession(
        100, // $100 price
        'usd',
        randomProductName,
        successUrl,
        cancelUrl
      );
      
      // Redirect to checkout
      await StripeService.redirectToCheckout(checkout.checkoutUrl);
      
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsStripeLoading(false);
    }
  };

  // Handle Whop payment for $100 offer
  const handleWhopPayment = async () => {
    if (!whoApiKey) {
      alert('Whop configuration is missing. Please contact support.');
      return;
    }
    
    try {
      setIsWhopLoading(true);
      
      // Initialize WhoService with API key
      WhoService.initWho(whoApiKey);
      
      // Generate a random product name for privacy
      const productNames = [
        "Premium Content Package",
        "Digital Media Collection",
        "Exclusive Content Bundle",
        "Premium Access Package"
      ];
      const randomProductName = productNames[Math.floor(Math.random() * productNames.length)];
      
      // Build success and cancel URLs (usando HashRouter)
      // Nota: session_id será gerado automaticamente na página de sucesso
      const successUrl = `${window.location.origin}/#/payment-success?payment_method=who&offer_type=all_content&price=100`;
      const cancelUrl = `${window.location.origin}/#/?payment_canceled=true`;
      
      // Create checkout session
      const checkoutUrl = await WhoService.createCheckoutSession(
        100, // $100 price
        'usd',
        randomProductName,
        successUrl,
        cancelUrl
      );
      
      // Redirect to checkout
      await WhoService.redirectToCheckout(checkoutUrl);
      
    } catch (error) {
      console.error('Error processing Whop payment:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsWhopLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
      {/* Animação CSS para seta pulsante */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1200,
          mx: 'auto',
          borderRadius: { xs: 0, sm: 2 },
          p: { xs: 2, sm: 2.5 },
          background: theme => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(3,9,37,0.96) 0%, rgba(2,6,23,0.99) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,250,0.98) 100%)',
          backdropFilter: 'blur(10px)',
          border: theme => `1px solid ${theme.palette.divider}`,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 4px 16px rgba(0,0,0,0.3)'
            : '0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Conteúdo Principal - Mais compacto */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    background: theme => theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #fff 0%, #aaa 100%)'
                      : 'linear-gradient(90deg, #000 0%, #555 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🎉 Special Offer - All Content $100
                </Typography>

                <Typography sx={{ fontSize: '0.85rem', color: theme => theme.palette.text.secondary, mb: 1.5 }}>
                  Complete collection • Instant delivery • Secure payment
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    href={computedTelegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<TelegramIcon />}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontSize: '0.85rem',
                    }}
                  >
                    Telegram
                  </Button>
                  
                  {/* Stripe Payment Button - Only show if configured */}
                  {!configLoading && (
                    <Button
                      variant="contained"
                      onClick={handleStripePayment}
                      disabled={isStripeLoading}
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        px: 2.5,
                        py: 0.75,
                        borderRadius: 1.5,
                        fontSize: '0.85rem',
                        boxShadow: 3,
                      }}
                    >
                      {isStripeLoading ? 'Processing...' : 'Pay (Card, Apple Pay etc)'}
                    </Button>
                  )}
                  
                  {/* Whop Payment Button - Only show if configured */}
                  {!configLoading && whoApiKey && whoApiKey.trim() !== '' && (
                    <Button
                      variant="contained"
                      onClick={handleWhopPayment}
                      disabled={isWhopLoading}
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        px: 2.5,
                        py: 0.75,
                        borderRadius: 1.5,
                        fontSize: '0.85rem',
                        boxShadow: 3,
                      }}
                    >
                      {isWhopLoading ? 'Processing...' : 'PAY'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Benefits - Mais compacto */}
          <Grid item xs={12} md={4}>
            <Box sx={{
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              p: 1.5,
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Full access</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>Auto delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>One-time payment</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Seta animada indicando mais conteúdo abaixo */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 1,
          mb: -1,
        }}
      >
        <Box
          sx={{
            animation: 'bounce 2s ease-in-out infinite',
            color: theme => theme.palette.primary.main,
            fontSize: '2rem',
            opacity: 0.6,
            cursor: 'pointer',
            '&:hover': {
              opacity: 1,
            },
          }}
          onClick={() => {
            window.scrollTo({
              top: window.scrollY + 300,
              behavior: 'smooth'
            });
          }}
        >
          ↓
        </Box>
      </Box>
    </Box>
  );
};

export default PromoOfferBanner;


