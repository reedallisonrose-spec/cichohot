import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TelegramIcon from '@mui/icons-material/Telegram';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Skeleton from '@mui/material/Skeleton';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import { VideoService } from '../services/VideoService';
import { useSiteConfig } from '../context/SiteConfigContext';
import { StripeService } from '../services/StripeService';
import { isPayJsrCheckoutAvailable } from '../utils/payjsrAvailability';
import MultiVideoPreview from './MultiVideoPreview';

interface VideoCardProps {
  video: {
    $id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string;
    isPurchased?: boolean;
    duration?: string | number;
    views?: number;
    createdAt?: string;
    created_at?: string;
    // Support for multiple videos in preview
    relatedVideos?: Array<{
      $id: string;
      title: string;
      thumbnailUrl?: string;
      duration?: string | number;
      price: number;
    }>;
    is_free?: boolean;
    product_link?: string;
  };
}

const VideoCard: FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const { telegramUsername, stripePublishableKey, stripeSecretKey, cryptoWallets, whoApiKey, paypalClientId, loading: configLoading } = useSiteConfig();
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState('');
  
  const handleCardClick = async () => {
    try {
      // Increment view count
      await VideoService.incrementViews(video.$id);
      
      // Navigate to video page
      navigate(`/video/${video.$id}`);
    } catch (error) {
      console.error('Error handling video card click:', error);
      // Navigate anyway even if incrementing views fails
      navigate(`/video/${video.$id}`);
    }
  };

  // Format the duration nicely
  const formatDuration = (duration?: string | number) => {
    if (duration === undefined || duration === null) return '00:00';
    
    // If duration is a number (seconds), convert to string format
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}min ${seconds}s`;
    }
    
    // If duration is already a string, check format
    if (typeof duration === 'string') {
      try {
        // Check if duration is in format MM:SS or HH:MM:SS
        const parts = duration.split(':');
        if (parts.length === 2) {
          return `${parts[0]}min ${parts[1]}s`;
        } else if (parts.length === 3) {
          return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
        }
      } catch (error) {
        console.error('Error formatting duration:', error);
        // Return the original string if split fails
        return duration;
      }
    }
    
    // Return as is if we can't parse it
    return String(duration);
  };

  // Format view count with K, M, etc.
  const formatViews = (views?: number) => {
    if (views === undefined) return '0 views';
    if (views < 1000) return `${views} views`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
  };

  // Format date to relative time
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Ajuste para lidar com formato created_at ou createdAt
  const createdAtField = video.createdAt || video.created_at;

  // Handle thumbnail loading states
  useEffect(() => {
    if (video.thumbnailUrl) {
      setIsThumbnailLoading(true);
      setThumbnailError(false);
    } else {
      setIsThumbnailLoading(false);
    }
  }, [video.thumbnailUrl]);

  const handleThumbnailLoad = () => {
    setIsThumbnailLoading(false);
  };

  const handleThumbnailError = () => {
    setIsThumbnailLoading(false);
    setThumbnailError(true);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/video/${video.$id}`);
  };

  const handleTelegramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Format date for "Added" field
    const formatAddedDate = (date: Date) => {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    };
    
    const msg = `🎬 **${video.title}**

💰 **Price:** $${video.price.toFixed(2)}
⏱️ **Duration:** ${formatDuration(video.duration)}
👀 **Views:** ${formatViews(video.views)}
📅 **Added:** ${formatAddedDate(new Date(video.createdAt || video.created_at || Date.now()))}

📝 **Description:**
${video.description || 'No description available'}

Please let me know how to proceed with payment.`;
    
    const encoded = encodeURIComponent(msg);
    const base = telegramUsername ? `https://t.me/${telegramUsername.replace('@', '')}` : 'https://t.me/share/url';
    const url = telegramUsername ? `${base}?text=${encoded}` : `${base}?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Create Telegram href for the button
  const telegramHref = (() => {
    if (!telegramUsername) return 'https://t.me/share/url';
    
    // Format date for "Added" field
    const formatAddedDate = (date: Date) => {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    };
    
    const msg = `🎬 **${video.title}**

💰 **Price:** $${video.price.toFixed(2)}
⏱️ **Duration:** ${formatDuration(video.duration)}
👀 **Views:** ${formatViews(video.views)}
📅 **Added:** ${formatAddedDate(new Date(video.createdAt || video.created_at || Date.now()))}

📝 **Description:**
${video.description || 'No description available'}

Please let me know how to proceed with payment.`;
    
    const encoded = encodeURIComponent(msg);
    return `https://t.me/${telegramUsername.replace('@', '')}?text=${encoded}`;
  })();

  const handleStripePay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPaymentModal(true);
  };

  const handleStripePayment = async () => {
    try {
      setIsStripeLoading(true);
      await StripeService.initStripe(stripePublishableKey);
      const productName = 'Video Access';
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${video.$id}&payment_method=stripe`;
      const cancelUrl = 'https://www.google.com/';
      const checkout = await StripeService.createCheckoutSession(
        video.price,
        'usd',
        productName,
        successUrl,
        cancelUrl
      );
      await StripeService.redirectToCheckout(checkout.checkoutUrl);
    } catch (err) {
      console.error('Stripe payment error:', err);
    } finally {
      setIsStripeLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleWhoPayment = async () => {
    if (!whoApiKey) return;
    
    try {
      setIsStripeLoading(true);
      
      // Importar o WhoService dinamicamente
      const { WhoService } = await import('../services/WhoService');
      
      // Initialize WhoService with API key
      WhoService.initWho(whoApiKey);
      
      const productName = 'Video Access';
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${video.$id}&session_id={CHECKOUT_SESSION_ID}&payment_method=who`;
      const cancelUrl = `${window.location.origin}/#/video/${video.$id}?payment_canceled=true`;
      
      const checkoutUrl = await WhoService.createCheckoutSession(
        video.price,
        'usd',
        productName,
        successUrl,
        cancelUrl
      );
      
      await WhoService.redirectToCheckout(checkoutUrl);
    } catch (err) {
      console.error('Whop payment error:', err);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsStripeLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handlePayPalPayment = () => {
    if (!paypalClientId) return;
    
    // Prevenir múltiplas chamadas simultâneas
    if (isStripeLoading) {
      return;
    }
    
    try {
      setIsStripeLoading(true);
      
      const productNames = [
        "Personal Development Ebook",
        "Financial Freedom Ebook",
        "Digital Marketing Guide",
        "Health & Wellness Ebook",
        "Productivity Masterclass",
        "Mindfulness & Meditation Guide",
        "Entrepreneurship Blueprint"
      ];
      const randomProductName = productNames[Math.floor(Math.random() * productNames.length)];
      
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${video.$id}&payment_method=paypal`;
      const cancelUrl = 'https://www.google.com/';
      
      const CHECKOUT_BASE = import.meta.env.VITE_CHECKOUT_URL || (import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || ''));
      const maskedUrl = `${CHECKOUT_BASE}/api/paypal-checkout?` + new URLSearchParams({
        amount: video.price.toFixed(2),
        currency: 'USD',
        video_id: video.$id || '',
        success_url: successUrl,
        cancel_url: cancelUrl,
        product_name: randomProductName,
        display_title: video.title,
      }).toString();
      
      // Abrir o checkout sempre na mesma aba para evitar janelas duplicadas
      window.location.href = maskedUrl;
      
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      alert('Failed to initialize PayPal payment. Please try again.');
    } finally {
      // Reset após um pequeno delay para permitir que a janela abra
      setTimeout(() => setIsStripeLoading(false), 500);
    }
  };

  const handleCryptoPayment = () => {
    if (!selectedCryptoWallet) return;
    
    const [cryptoType, walletAddress] = selectedCryptoWallet.split(':');
    
    if (!telegramUsername) return;
    
    const message = `₿ **Crypto Payment Request**

📹 **Video:** ${video.title}
💰 **Amount:** $${video.price.toFixed(2)}
🪙 **Cryptocurrency:** ${cryptoType.toUpperCase()}
💼 **My Wallet:** ${walletAddress}
📅 **Date:** ${new Date().toLocaleString()}

I'm sending the payment from my wallet. Please confirm the transaction and provide access to the content.`;
    
    const encoded = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}?text=${encoded}`;
    
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    setShowPaymentModal(false);
  };

  return (
    <>
      {/* Add CSS animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          borderRadius: 15,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: theme =>
            theme.palette.mode === 'dark'
              ? '0 10px 30px rgba(15,23,42,0.9)'
              : '0 8px 24px rgba(15,23,42,0.18)',
          cursor: 'pointer',
          backgroundColor: theme => theme.palette.background.paper,
          border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme =>
              theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(37,99,235,0.65)'
                : '0 16px 36px rgba(37,99,235,0.35)',
            borderColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(129,140,248,0.6)'
                : 'rgba(37,99,235,0.4)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: -4,
            height: 10,
            borderRadius: '999px',
            background:
              'radial-gradient(circle at 50% 0, rgba(56,189,248,0.55), transparent 60%)',
            opacity: 0,
            filter: 'blur(6px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            transform: 'scaleX(0.8)',
            pointerEvents: 'none',
          },
          '&:hover::after': {
            opacity: 1,
            transform: 'scaleX(1)',
          },
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
        {/* Multi-video preview (from previewSources) or single thumbnail */}
        {(video as any).previewSources && (video as any).previewSources.length > 0 ? (
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <MultiVideoPreview
              videos={[(video as any).previewSources].flat().slice(0,3).map((src: any, idx: number) => ({
                $id: `${video.$id}::${src.id}`,
                title: video.title,
                thumbnailUrl: src.thumbnail_file_id ? undefined : video.thumbnailUrl,
                duration: video.duration,
                price: video.price
              }))}
              onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
              autoPlay={isHovered}
              showControls={isHovered}
            />
          </Box>
        ) : (
          <>
            {/* Single thumbnail image */}
        {video.thumbnailUrl && !thumbnailError ? (
          <CardMedia
            component="img"
            loading="lazy"
            image={video.thumbnailUrl}
            alt={video.title}
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: theme => theme.palette.background.default,
            }}
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
          />
        ) : (
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#020617' : '#f5f5f5',
            }} 
            animation="wave" 
          />
            )}
          </>
        )}

        {/* Loading indicator overlay */}
        {isThumbnailLoading && video.thumbnailUrl && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            <CircularProgress 
              size={40} 
              thickness={4}
              sx={{ 
                color: theme => theme.palette.primary.main,
                mb: 1,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}

        {/* Error state overlay */}
        {thumbnailError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#020617' : '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme => theme.palette.mode === 'dark' ? '#999' : '#666',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
            >
              Video Thumbnail
            </Typography>
          </Box>
        )}
        
        {/* Removed adult content indicator */}
        {/* FREE badge */}
        {video.is_free && (
          <Chip 
            label="FREE" 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 64, 
              backgroundColor: '#27ae60', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '0.8rem', 
              height: '22px', 
              zIndex: 2,
            }}
          />
        )}
        
        {/* Hover overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(15,23,42,0.5) 50%, rgba(15,23,42,0.3) 100%)' 
              : 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)',
            opacity: isHovered ? 1 : (theme => theme.palette.mode === 'dark' ? 0.4 : 0.6),
            transition: 'all 0.3s ease',
          }}
        />
        
        {/* Duration badge */}
        {video.duration && (
          <Chip 
            label={formatDuration(video.duration)} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              backgroundColor: 'rgba(2,6,23,0.9)',
              color: 'white',
              fontWeight: 'bold',
              height: '24px',
              '& .MuiChip-label': {
                px: 1,
              }
            }}
            icon={<AccessTimeIcon sx={{ color: 'white', fontSize: '14px' }} />}
          />
        )}
        
        {/* Price badge - Pink/Red style */}
        <Chip 
          label={`$${video.price.toFixed(2)}`} 
          size="medium" 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            height: '32px',
            backgroundColor: theme => theme.palette.primary.main,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            '& .MuiChip-label': {
              color: 'white',
              fontWeight: 'bold',
              px: 1.5
            }
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2, pt: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{
          fontWeight: 'bold',
          fontSize: '1rem',
          lineHeight: 1.2,
          mb: 1,
          height: '2.4rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          color: theme => theme.palette.text.primary,
        }}>
          {video.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme => theme.palette.text.secondary }}>
            <VisibilityIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              {formatViews(video.views)}
            </Typography>
          </Box>
          
          {createdAtField && (
            <Typography variant="caption" sx={{ color: theme => theme.palette.text.secondary }}>
              {formatDate(createdAtField)}
            </Typography>
          )}
        </Box>

        {/* Actions: Preview and Payment/Link buttons - Mobile optimized */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
          {/* Preview button - Always first and full width */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<VisibilityIcon />}
            onClick={handlePreviewClick}
            sx={{
              py: 0.75,
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'none',
            }}
          >
            Preview
          </Button>

          {/* Conditional second row based on video type */}
          {video.is_free && video.product_link ? (
            // For FREE videos with product link
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={e => {
                e.stopPropagation();
                window.open(video.product_link, '_blank');
              }}
              sx={{ 
                py: 0.75,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                textTransform: 'none',
              }}
            >
              Product Link
            </Button>
          ) : !video.is_free ? (
            // For PAID videos - Payment options in row
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<TelegramIcon />}
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: 0.75,
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                }}
              >
                Telegram
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CreditCardIcon />}
                onClick={handleStripePay}
                disabled={isStripeLoading}
                sx={{
                  py: 0.75,
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  textTransform: 'none',
              backgroundColor: theme => theme.palette.primary.main,
              color: 'white',
                  '&:hover': {
            backgroundColor: theme => theme.palette.secondary.main,
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#999'
                  }
                }}
              >
                Payment options
              </Button>
            </Box>
          ) : null}
        </Box>

      </CardContent>
      </Card>

      {/* Payment Options Modal */}
      {!video.is_free && (
        <Dialog 
          open={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: theme => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #020617 0%, #020c2a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #e5f0ff 100%)',
              borderRadius: 3,
              border: theme => theme.palette.mode === 'dark'
                ? '1px solid rgba(129,140,248,0.5)'
                : '1px solid rgba(37,99,235,0.2)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(15,23,42,0.9)'
                : '0 14px 32px rgba(15,23,42,0.25)',
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: theme => theme.palette.mode === 'dark' ? '1px solid rgba(148,163,255,0.4)' : '1px solid rgba(37,99,235,0.15)' }}>
            <Typography variant="h6" sx={{ color: theme => theme.palette.mode === 'dark' ? 'white' : '#0f172a', fontWeight: 'bold' }}>
              Select Payment Method
            </Typography>
            <Button onClick={() => setShowPaymentModal(false)} sx={{ color: theme => theme.palette.mode === 'dark' ? '#e5e7eb' : '#0f172a', minWidth: 'auto', p: 0 }}>
              <CloseIcon />
            </Button>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {/* Privacy and delivery notice */}
            <Box sx={{ mb: 2, p: 1.5, backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(37,99,235,0.2)' : 'rgba(191,219,254,0.6)', borderRadius: 2, border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(129,140,248,0.8)' : '1px solid rgba(37,99,235,0.45)' }}>
              <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#e5f0ff' : '#1d4ed8', textAlign: 'center', fontWeight: 'bold' }}>
                For privacy, generic names will appear during automatic payment checkout.<br />
                Content is delivered automatically after payment.
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: theme => theme.palette.text.secondary, mb: 3, textAlign: 'center' }}>
              Video: <strong>{video.title}</strong>
              <br />
              Price: <strong style={{ color: '#4caf50' }}>${video.price.toFixed(2)}</strong>
            </Typography>

            {/* PayJSR — só se chave no admin ou VITE_PAYJSR_ENABLED */}
            {!configLoading && isPayJsrCheckoutAvailable(stripeSecretKey) && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PaymentIcon />}
                onClick={handleStripePayment}
                disabled={isStripeLoading}
                sx={{
                  mb: 2,
                  py: 2,
                  background: 'linear-gradient(135deg, #4fc3f7 0%, #38bdf8 40%, #0ea5e9 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 45%, #0284c7 100%)',
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#999'
                  }
                }}
              >
                {isStripeLoading ? 'Processing...' : 'Pay (Card, Apple Pay etc)'}
              </Button>
            )}

            {/* Whop Payment - Only show if configured */}
            {!configLoading && whoApiKey && whoApiKey.trim() !== '' && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CreditCardIcon />}
                onClick={handleWhoPayment}
                disabled={isStripeLoading || !whoApiKey}
                sx={{
                  mb: 2,
                  py: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #312e81 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 55%, #1d2671 100%)',
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#999'
                  }
                }}
              >
                {isStripeLoading ? 'Processing...' : 'Pay with Whop'}
              </Button>
            )}

            {/* PayPal masked checkout */}
            {!configLoading && paypalClientId && paypalClientId.trim() !== '' && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CreditCardIcon />}
                onClick={handlePayPalPayment}
                disabled={isStripeLoading}
                sx={{
                  mb: 2,
                  py: 2,
                  background: 'linear-gradient(135deg, #0070ba 0%, #1546a0 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0083d0 0%, #1852b0 100%)',
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#999'
                  }
                }}
              >
                {isStripeLoading ? 'Processing...' : 'Pay with PayPal or card'}
              </Button>
            )}

            {/* Crypto Payment */}
            <Box>
              {cryptoWallets && cryptoWallets.length > 0 ? (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Select Crypto Wallet</InputLabel>
                    <Select
                      value={selectedCryptoWallet}
                      onChange={(e) => setSelectedCryptoWallet(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme => theme.palette.primary.main,
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#ccc'
                        }
                      }}
                    >
                      {cryptoWallets.map((wallet: string, index: number) => {
                        const [cryptoType] = wallet.split(':');
                        return (
                          <MenuItem key={index} value={wallet}>
                            {cryptoType.toUpperCase()} Wallet
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<AccountBalanceWalletIcon />}
                    onClick={handleCryptoPayment}
                    disabled={!selectedCryptoWallet || !telegramUsername}
                    sx={{
                      py: 2,
                      background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #facc15 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f7931a 40%, #ff9900 100%)',
                      },
                      '&:disabled': {
                        background: '#555',
                        color: '#999'
                      }
                    }}
                  >
                    ₿ Pay with Cryptocurrency
                  </Button>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', py: 2 }}>
                  Crypto wallets not configured
                </Typography>
              )}
            </Box>

            {/* Bonus Message */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(142, 36, 170, 0.1)', borderRadius: 2, border: '1px solid rgba(142, 36, 170, 0.3)' }}>
              <Typography variant="body2" sx={{ color: '#4caf50', textAlign: 'center', fontWeight: 'bold' }}>
                🎁 Bonus: After payment, message us on Telegram for free bonus pack!
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VideoCard; 