import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TelegramIcon from '@mui/icons-material/Telegram';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// Removed Dialog-based payment options
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
//
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAuth } from '../services/Auth';
import { useSiteConfig } from '../context/SiteConfigContext';
import { VideoService, Video } from '../services/VideoService';
import VideoCard from '../components/VideoCard';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { StripeService } from '../services/StripeService';
import { isPayJsrCheckoutAvailable } from '../utils/payjsrAvailability';
import { WhoService } from '../services/WhoService';
import { PayPalService, PayPalScriptProvider, PayPalButtons } from '../services/PayPalService';
import Chip from '@mui/material/Chip';

// Extend Video interface to include product_link
declare module '../services/VideoService' {
  interface Video {
    product_link?: string;
  }
}

// SVG icons for main cryptos
const cryptoIcons: Record<string, JSX.Element> = {
  BTC: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f7931a"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">₿</text></svg>,
  ETH: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#3c3c3d"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">Ξ</text></svg>,
  USDT: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26a17b"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">T</text></svg>,
  BNB: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f3ba2f"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">BNB</text></svg>,
  SOL: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#66f9a1"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#222" fontWeight="bold">◎</text></svg>,
  XRP: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#23292f"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">XRP</text></svg>,
  ADA: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0033ad"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">ADA</text></svg>,
  DOGE: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#c2a633"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">Ð</text></svg>,
  AVAX: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#e84142"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">A</text></svg>,
  DOT: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#e6007a"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">●</text></svg>,
  MATIC: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#8247e5"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">M</text></svg>,
  SHIB: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f47321"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">S</text></svg>,
};



const VideoPlayer: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { telegramUsername, stripePublishableKey, stripeSecretKey, cryptoWallets, siteName, whoApiKey, paypalClientId, loading: configLoading } = useSiteConfig();
  const [video, setVideo] = useState<Video | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoSources, setVideoSources] = useState<Array<{ id: string; source_file_id: string }>>([]);
  const [allVideoUrls, setAllVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [suggestedVideos, setSuggestedVideos] = useState<Video[]>([]);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [copiedWalletIndex, setCopiedWalletIndex] = useState<number | null>(null);
  const [purchasedProductName, setPurchasedProductName] = useState<string>("");
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  // Simplified payment (direct Stripe or Crypto modal)
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState('');
  const theme = useTheme();
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [showCancelMessage, setShowCancelMessage] = useState(false);

  // Debug: Log Whop API key when it changes
  useEffect(() => {
    if (!whoApiKey && !configLoading) {
      console.warn('[Whop] API Key is empty or not configured');
    }
  }, [whoApiKey, configLoading]);

  // Detectar se o pagamento foi cancelado
  useEffect(() => {
    const paymentCanceled = searchParams.get('payment_canceled');
    if (paymentCanceled === 'true') {
      setShowCancelMessage(true);
      console.log('✅ REDIRECIONAMENTO WHOP FUNCIONANDO! URL contém: payment_canceled=true');
      // Limpar o parâmetro da URL após 8 segundos
      setTimeout(() => {
        setShowCancelMessage(false);
        searchParams.delete('payment_canceled');
        setSearchParams(searchParams);
      }, 8000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) {
        setError('Invalid video ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Reset purchase state when loading a new video
        setPurchaseError(null);
        setPreviewUrl(null);

        // Get video details
        const videoData = await VideoService.getVideo(id);
        if (!videoData) {
          setError('Video not found');
          setLoading(false);
          return;
        }
        
        setVideo(videoData);
        
        // Increment view count
        await VideoService.incrementViews(id);

        // Get preview or first source URL
        try {
          const sources = await VideoService.getVideoSources(id);
          setVideoSources(sources.map(s => ({ id: s.id, source_file_id: s.source_file_id })));

          const allUrls: string[] = [];

          // Add main video first if it exists
          const mainVideoUrl = await VideoService.getVideoFileUrl(id);
          if (mainVideoUrl) {
            allUrls.push(mainVideoUrl);
            setPreviewUrl(mainVideoUrl);
          }
          
          // Add first extra source if exists (we não precisamos de navegação entre várias)
          if (sources.length > 0) {
            const firstSourceUrl = await VideoService.getFileUrlById(sources[0].source_file_id);
            if (firstSourceUrl) {
              allUrls.push(firstSourceUrl);
            }
          }
          setAllVideoUrls(allUrls);
        } catch (err) {
          console.error('Error loading preview video:', err);
          // Don't set error, just log it - the thumbnail will be shown instead
        }
        
        // Note: Purchase flow is now handled by redirecting to /payment-success page
        
        // Load suggested videos in background (non-blocking, progressive)
        // This will not block the main video from loading
        VideoService.getVideoIds()
          .then(async (allVideoIds) => {
            const filteredIds = allVideoIds
              .filter(vId => vId !== id)
              .slice(0, 8); // Limit to 8 videos
            
            // Load videos progressively
            const suggestedVideosList: Video[] = [];
            for (const videoId of filteredIds) {
              try {
                const videoData = await VideoService.getVideo(videoId);
                if (videoData) {
                  suggestedVideosList.push(videoData);
                  setSuggestedVideos([...suggestedVideosList]); // Update immediately
                }
                // Small delay between videos
                await new Promise(resolve => setTimeout(resolve, 50));
              } catch (err) {
                console.error(`Error loading suggested video ${videoId}:`, err);
              }
            }
          })
          .catch(err => {
            console.error('Error loading suggested videos:', err);
            // Don't set error state for suggested videos, just log it
          });
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id, user]);

  // Format duration (e.g., "1:30" to "1 min 30 sec")
  const formatDuration = (duration?: string | number) => {
    if (!duration) return 'Unknown';
    
    if (typeof duration === 'string') {
      // Parse MM:SS or HH:MM:SS format
      const parts = duration.split(':').map(Number);
      
        if (parts.length === 2) {
        // MM:SS format
        const [minutes, seconds] = parts;
        
        if (minutes === 0) {
          return `${seconds} sec`;
        } else if (seconds === 0) {
          return `${minutes} min`;
        } else {
          return `${minutes} min ${seconds} sec`;
        }
        } else if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, minutes, seconds] = parts;
        
        if (hours === 0) {
          // No hours, format as minutes and seconds
          if (minutes === 0) {
            return `${seconds} sec`;
          } else if (seconds === 0) {
            return `${minutes} min`;
          } else {
            return `${minutes} min ${seconds} sec`;
          }
        } else {
          // Include hours
          if (minutes === 0 && seconds === 0) {
            return `${hours} hr`;
          } else if (seconds === 0) {
            return `${hours} hr ${minutes} min`;
          } else if (minutes === 0) {
            return `${hours} hr ${seconds} sec`;
          } else {
            return `${hours} hr ${minutes} min ${seconds} sec`;
          }
        }
      }
    }
    
    // If we can't parse it, just return as is
    return duration.toString();
  };

  // Format views with K/M suffix for thousands/millions
  const formatViews = (views?: number) => {
    if (views === undefined) return '0 views';
    
    if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    } else {
      return `${views} views`;
    }
  };

  // Create Telegram href for the button
  const telegramHref = (() => {
    if (!video) {
      return telegramUsername ? `https://t.me/${telegramUsername.replace('@', '')}` : 'https://t.me/share/url';
    }
    
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
📅 **Added:** ${formatAddedDate(new Date(video.createdAt || Date.now()))}

📝 **Description:**
${video.description || 'No description available'}

Please let me know how to proceed with payment.`;
    
    const encoded = encodeURIComponent(msg);
    if (telegramUsername) {
      return `https://t.me/${telegramUsername.replace('@', '')}?text=${encoded}`;
    } else {
      return `https://t.me/share/url?text=${encoded}`;
    }
  })();

  const handleBack = () => {
    navigate(-1);
  };

  // Format date to readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };


  // Função para obter um nome de produto genérico aleatório em inglês
  const getRandomProductName = () => {
    const productNames = [
      "Personal Development Ebook",
      "Financial Freedom Ebook",
      "Digital Marketing Guide",
      "Health & Wellness Ebook",
      "Productivity Masterclass",
      "Mindfulness & Meditation Guide",
      "Entrepreneurship Blueprint"
    ];
    
    const randomIndex = Math.floor(Math.random() * productNames.length);
    return productNames[randomIndex];
  };



  // Handle Whop payment (similar to Stripe)
  const handleWhoPaymentRedirect = async () => {
    if (!video || !whoApiKey) {
      setPurchaseError('Whop configuration is missing or video information not available');
      return;
    }
    
    try {
      setIsStripeLoading(true);
      
      // Initialize Whop
      WhoService.initWho(whoApiKey);
      
      // Generate a random product name
      const randomProductName = getRandomProductName();
      setPurchasedProductName(randomProductName);
      
      // Build success and cancel URLs (with # for HashRouter)
      // Nota: session_id será gerado automaticamente na página de sucesso
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${id}&payment_method=who`;
      const cancelUrl = `${window.location.origin}/#/video/${id}?payment_canceled=true`;
      
      // Create checkout session
      const sessionId = await WhoService.createCheckoutSession(
        video.price,
        'usd',
        randomProductName,
        successUrl,
        cancelUrl
      );
      
      // Redirect to checkout
      await WhoService.redirectToCheckout(sessionId);
      
    } catch (error) {
      console.error('Error processing Whop payment:', error);
      setPurchaseError('Failed to initialize Whop payment. Please try again.');
    } finally {
      setIsStripeLoading(false);
    }
  };


  // Handle crypto payment from modal
  const handleCryptoPaymentFromModal = () => {
    if (!selectedCryptoWallet) return;
    
    const [cryptoType, walletAddress] = selectedCryptoWallet.split(':');
    
    if (!telegramUsername) return;
    
    const message = `₿ **Crypto Payment Request**

📹 **Video:** ${video?.title}
💰 **Amount:** $${video?.price.toFixed(2)}
🪙 **Cryptocurrency:** ${cryptoType.toUpperCase()}
💼 **My Wallet:** ${walletAddress}
📅 **Date:** ${new Date().toLocaleString()}

I'm sending the payment from my wallet. Please confirm the transaction and provide access to the content.`;
    
    const encoded = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}?text=${encoded}`;
    
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle Stripe payment (Nova função apenas para redirecionamento)
  const handleStripePaymentRedirect = async () => {
    if (!video) {
      setPurchaseError('Video information not available');
      return;
    }
    
    try {
      setIsStripeLoading(true);
      
      // Initialize Stripe
      await StripeService.initStripe(stripePublishableKey);
      
      // Generate a random product name
      const randomProductName = getRandomProductName();
      setPurchasedProductName(randomProductName);
      
      // Build success and cancel URLs (with # for HashRouter)
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${id}&payment_method=stripe`;
      const cancelUrl = 'https://www.google.com/';
      
      // Create checkout session
      const checkout = await StripeService.createCheckoutSession(
        video.price,
        'usd',
        randomProductName,
        successUrl,
        cancelUrl
      );
      
      // Redirect to checkout
      await StripeService.redirectToCheckout(checkout.checkoutUrl);
      
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      setPurchaseError('Failed to initialize Stripe payment. Please try again.');
    } finally {
      setIsStripeLoading(false);
    }
  };

  // Handle PayPal payment - abre uma única janela com a página de checkout
  const handlePayPalPayment = () => {
    if (!video || !paypalClientId) {
      setPurchaseError('PayPal configuration is missing or video information not available');
      return;
    }
    
    // Prevenir múltiplas chamadas simultâneas
    if (isStripeLoading) {
      return;
    }
    
    try {
      setIsStripeLoading(true);
      
      const randomProductName = getRandomProductName();
      setPurchasedProductName(randomProductName);
      
      const successUrl = `${window.location.origin}/#/payment-success?video_id=${id}&payment_method=paypal`;
      const cancelUrl = 'https://www.google.com/';
      
      const CHECKOUT_BASE = import.meta.env.VITE_CHECKOUT_URL || (import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || ''));
      const maskedUrl = `${CHECKOUT_BASE}/api/paypal-checkout?` + new URLSearchParams({
        amount: video.price.toFixed(2),
        currency: 'USD',
        video_id: id || '',
        success_url: successUrl,
        cancel_url: cancelUrl,
        product_name: randomProductName,
        display_title: video.title,
      }).toString();
      
      // Abrir o checkout sempre na mesma aba para evitar janelas duplicadas
      window.location.href = maskedUrl;
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      setPurchaseError('Failed to initialize PayPal payment. Please try again.');
    } finally {
      // Reset após um pequeno delay para permitir que a janela abra
      setTimeout(() => setIsStripeLoading(false), 500);
    }
  };

  // Removed modal-based Stripe handler

  // Note: Stripe payment success is now handled by redirecting to /payment-success page

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '500px' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
      <Box sx={{ 
      bgcolor: theme.palette.background.default, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
        width: '100%', 
      overflow: 'hidden' 
    }}>
      {/* Video player section (sem overlays nem navegação extra) */}
      <Box sx={{ width: '100%', bgcolor: '#020617' }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative'
        }}>
          {allVideoUrls.length > 0 || previewUrl ? (
            // Native browser player (carrega direto para evitar problemas de reprodução)
            <Box ref={videoContainerRef} sx={{ 
              width: '100%',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#020617'
            }}>
              <video 
                src={allVideoUrls[0] || previewUrl || undefined}
                controls 
                autoPlay={false}
                preload="none"
                poster={video?.thumbnailUrl}
                onError={(e) => {
                  console.error('Video load error:', e);
                  console.error('Video URL:', allVideoUrls[0] || previewUrl);
                  console.error('Thumbnail URL:', video?.thumbnailUrl);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '1200px',
                  maxHeight: '500px',
                  objectFit: 'contain',
                backgroundColor: '#020617',
                  zIndex: 1000 /* Ensure video controls are above overlay */
                }}
              >
                {(allVideoUrls[0] || previewUrl) && (
                  <source src={allVideoUrls[0] || previewUrl || undefined} type="video/mp4" />
                )}
                Seu navegador não suporta o elemento de vídeo.
              </video>

            </Box>
          ) : (
            // Show only the thumbnail if no video URL
            <Box sx={{ 
              width: '100%',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#020617',
              position: 'relative'
            }}>
            <CardMedia
              component="img"
              image={video?.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFByZXZpZXc8L3RleHQ+PC9zdmc+'}
              alt={video?.title || 'Video thumbnail'}
              onError={(e) => {
                console.error('Thumbnail failed to load:', video?.thumbnailUrl);
                console.error('Error event:', e);
                console.error('Video data:', video);
                // Fallback para placeholder
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvIFByZXZpZXc8L3RleHQ+PC9zdmc+';
              }}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: '1200px',
                backgroundColor: '#f5f5f5',
                minHeight: '300px'
              }}
            />
            </Box>
          )}
          </Box>
      </Box>
      
      {/* Content section */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1200px', 
        color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary, 
        mt: 6, 
        px: { xs: 2, md: 4 } 
      }}>
        <Box sx={{ mb: 6 }}>
        
        {purchaseError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {purchaseError}
          </Alert>
        )}
        
        {/* Mensagem de cancelamento de pagamento (texto mais simples para o cliente) */}
        {showCancelMessage && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            onClose={() => setShowCancelMessage(false)}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Payment cancelled
            </Typography>
            <Typography variant="body2">
              Your payment was cancelled. No charges were made and you can try again at any time.
            </Typography>
          </Alert>
        )}
        
        {/* Back button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Videos
        </Button>
        
        {/* Video title, badges and free link */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary, fontWeight: 'bold' }}>
            {video?.title || 'Video Details'}
          </Typography>
          {video?.is_free && (
            <Chip label="FREE" color="success" sx={{ fontWeight: 'bold', fontSize: '1rem', height: '32px' }} />
          )}
          {video?.is_free && video?.product_link && (
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{ fontWeight: 'bold', ml: 2 }}
              onClick={() => window.open(video.product_link, '_blank')}
            >
              View Product Link
            </Button>
          )}
        </Box>
        
        {/* Video description + simple checkout area */}
        <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2
            }}>
              
               {/* Price Display - Enhanced */}
               <Box sx={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 alignItems: 'center',
                 p: 1.5,
                 backgroundColor: theme.palette.mode === 'dark' ? 'rgba(229, 9, 20, 0.1)' : 'rgba(229, 9, 20, 0.05)',
                 borderRadius: 1.5,
                 border: theme => `1px solid ${theme.palette.primary.main}`,
                 minWidth: '120px'
               }}>
                 <Typography variant="h4" sx={{ 
                   fontWeight: 'bold', 
                  color: theme => theme.palette.primary.main,
                   fontSize: { xs: '1.4rem', sm: '1.6rem' },
                   lineHeight: 1
                 }}>
                   ${video?.price.toFixed(2)}
                 </Typography>
                 <Typography variant="caption" sx={{ 
                   color: theme.palette.mode === 'dark' ? '#ccc' : '#666',
                   fontSize: '0.7rem',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '0.3px',
                   mt: 0.3
                 }}>
                   One-time
                 </Typography>
               </Box>
            </Box>
          
          <Typography
            variant="body1"
            paragraph
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#ccc' : theme.palette.text.secondary, 
              mt: 2 
            }}
          >
            {video?.description}
          </Typography>
          
          {!video?.is_free && (
            <Box sx={{ mt: 4, maxWidth: 480 }}>
              {configLoading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Loading checkout configuration...
                </Alert>
              )}
              {/* PayJSR (card / Apple Pay etc.) — só se chave no admin ou VITE_PAYJSR_ENABLED */}
              {!configLoading && isPayJsrCheckoutAvailable(stripeSecretKey) && (
                <Button
                  fullWidth
                  onClick={handleStripePaymentRedirect}
                  disabled={isStripeLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                    color: '#002b36',
                    boxShadow: '0 6px 18px rgba(41,182,246,0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #81d4fa 0%, #29b6f6 100%)',
                      boxShadow: '0 10px 24px rgba(41,182,246,0.6)',
                    },
                    '&:active': {
                      boxShadow: '0 4px 14px rgba(41,182,246,0.5)',
                    },
                    '&:disabled': {
                      backgroundColor: '#9e9e9e',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isStripeLoading ? 'Processing…' : 'Pay (Card, Apple Pay etc)'}
                </Button>
              )}

              {/* PayPal masked checkout button */}
              {!configLoading && paypalClientId && paypalClientId.trim() !== '' && (
                <Button
                  fullWidth
                  onClick={handlePayPalPayment}
                  disabled={isStripeLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #0070ba 0%, #1546a0 100%)',
                    color: '#fff',
                    boxShadow: '0 6px 18px rgba(0,112,186,0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0083d0 0%, #1852b0 100%)',
                      boxShadow: '0 10px 24px rgba(0,112,186,0.6)',
                    },
                    '&:active': {
                      boxShadow: '0 4px 14px rgba(0,112,186,0.5)',
                    },
                    '&:disabled': {
                      backgroundColor: '#9e9e9e',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isStripeLoading ? 'Processing…' : 'Pay with PayPal or card'}
                </Button>
              )}

              {/* Opção de cripto como alternativa, em estilo secundário mais discreto */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowCryptoModal(true)}
                sx={{ py: 1.3, fontWeight: 600, fontSize: '0.95rem', borderRadius: 999 }}
              >
                Pay with Crypto
              </Button>

              {telegramUsername && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    startIcon={<TelegramIcon />}
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: '#229ED9', fontWeight: 'bold', textTransform: 'none' }}
                  >
                    Questions? Chat on Telegram
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
        
        {/* Suggested Videos Section */}
        {suggestedVideos.length > 0 && (
          <>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3, color: theme.palette.text.primary }}>
              More Like This
            </Typography>
            
            <Grid container spacing={3}>
              {suggestedVideos.map((suggestedVideo) => (
                <Grid item key={suggestedVideo.$id} xs={12} sm={6} md={3}>
                  <VideoCard video={suggestedVideo} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
        </Box>
      </Box>
      
      
      {/* Crypto Wallets Modal */}
      <Modal
        open={showCryptoModal}
        onClose={() => setShowCryptoModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        aria-labelledby="crypto-wallets-modal"
        aria-describedby="modal-with-crypto-wallets"
      >
        <Fade in={showCryptoModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 420 },
            bgcolor: theme.palette.mode === 'dark' ? '#181818' : '#fff',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Pay with Crypto
              </Typography>
              <IconButton onClick={() => setShowCryptoModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: theme.palette.mode === 'dark' ? '#aaa' : '#555' }}>
              Choose one of the wallets below to make your payment. <br />
              <b>After payment, send your proof of payment via Telegram for manual confirmation.</b>
            </Typography>
            {cryptoWallets.map((wallet, idx) => {
              // Parse wallet: "CODE:address" format (from Admin.tsx)
              let code = '';
              let name = '';
              let address = '';
              
              if (wallet.includes(':')) {
                // Format: "CODE:address"
                const parts = wallet.split(':');
                code = parts[0]?.trim() || '';
                address = parts[1]?.trim() || '';
                name = code; // Use code as name
              } else if (wallet.includes('\n')) {
                // Format: "CODE - Name\naddress" (legacy)
                const lines = wallet.split('\n');
                const header = lines[0];
                address = lines[1]?.trim() || '';
                
                if (header.includes(' - ')) {
                  const parts = header.split(' - ');
                  code = parts[0]?.trim() || '';
                  name = parts[1]?.trim() || '';
                } else {
                  name = header.trim();
                  code = header.trim().split(' ')[0];
                }
              } else {
                // Fallback: treat as address only
                address = wallet.trim();
                code = wallet.trim().split(' ')[0];
                name = 'Crypto Wallet';
              }
              
              // Only render if we have a valid address
              if (!address) return null;
              
              return (
                <Box key={idx} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#333' : '#eee',
                  borderRadius: 2,
                  background: theme.palette.mode === 'dark' ? '#232323' : '#fafafa',
                }}>
                  <Box sx={{ minWidth: 40 }}>{cryptoIcons[code] || <MonetizationOnIcon fontSize="large" />}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{name || code || 'Crypto Wallet'}</Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', color: theme.palette.mode === 'dark' ? '#fff' : '#222' }}>{address}</Typography>
                  </Box>
                  <Button
                    variant={copiedWalletIndex === idx ? 'contained' : 'outlined'}
                    color={copiedWalletIndex === idx ? 'success' : 'primary'}
                    size="small"
                    startIcon={copiedWalletIndex === idx ? <CheckCircleIcon /> : <ContentCopyIcon />}
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                      setCopiedWalletIndex(idx);
                      setTimeout(() => setCopiedWalletIndex(null), 2000);
                    }}
                    sx={{ minWidth: 90 }}
                  >
                    {copiedWalletIndex === idx ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>
              );
            }).filter(Boolean)}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<TelegramIcon />}
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact on Telegram
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      
      {/* Removed pre-payment and multi-option modals to simplify checkout */}
      
    </Box>
  );
};

export default VideoPlayer;
