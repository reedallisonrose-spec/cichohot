import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
 
import { Chip } from '@mui/material';
import { useAuth } from '../services/Auth';
import VideoCard from '../components/VideoCard';
import { VideoService, Video, SortOption } from '../services/VideoService';
import { useSiteConfig } from '../context/SiteConfigContext';
import FeaturedBanner from '../components/FeaturedBanner';
import PromoOfferBanner from '../components/PromoOfferBanner';
import DatabaseSetupModal from '../components/DatabaseSetupModal';
import CredentialsStatus from '../components/CredentialsStatus';
import ContactSection from '../components/ContactSection';
import TrustBadges from '../components/TrustBadges';
// Testimonials removido a pedido

// Skeleton card component for loading state
const VideoCardSkeleton: FC = () => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      bgcolor: 'background.paper'
    }}>
      <Skeleton 
        variant="rectangular" 
        sx={{ width: '100%', paddingTop: '56.25%' }} 
        animation="wave" 
      />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" sx={{ width: '30%' }} />
          <Skeleton variant="text" sx={{ width: '20%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading card component with progress indicator
const VideoCardLoading: FC<{ index: number }> = ({ index }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      bgcolor: 'background.paper',
      position: 'relative'
    }}>
      {/* Thumbnail area with progress indicator */}
      <Box sx={{ 
        width: '100%', 
        paddingTop: '56.25%', 
        position: 'relative',
        bgcolor: 'rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2
        }}>
          <CircularProgress 
            size={40} 
            thickness={4}
            sx={{ 
              color: 'primary.main',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Loading video {index + 1}...
          </Typography>
        </Box>
      </Box>
      
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" sx={{ width: '30%' }} />
          <Skeleton variant="text" sx={{ width: '20%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Home: FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [showSetupButton, setShowSetupButton] = useState(false);
  
  const [loadedVideos, setLoadedVideos] = useState<Video[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sectionOnlineNow, setSectionOnlineNow] = useState<number>(() => Math.floor(Math.random() * 101));
  const [sectionHappyCustomers] = useState<number>(() => Math.floor(Math.random() * (1300 - 700 + 1)) + 700);
  const [sectionRating] = useState<number>(() => parseFloat((Math.random() * 0.6 + 4.2).toFixed(1)));
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  
  const { user } = useAuth();
  const { videoListTitle, telegramUsername } = useSiteConfig();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const videosPerPage = 24; // Aumentar de 12 para 24 vídeos por página
  const shuffledVideoIdsRef = useRef<string[] | null>(null);

  const shuffleIds = (ids: string[]) => {
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Detectar se o pagamento foi cancelado
  useEffect(() => {
    const paymentCanceled = searchParams.get('payment_canceled');
    if (paymentCanceled === 'true') {
      setShowCancelMessage(true);
      console.log('✅ REDIRECIONAMENTO WHOP FUNCIONANDO! (Promo Banner) URL contém: payment_canceled=true');
      // Limpar o parâmetro da URL após 8 segundos
      setTimeout(() => {
        setShowCancelMessage(false);
        searchParams.delete('payment_canceled');
        setSearchParams(searchParams);
      }, 8000);
    }
  }, [searchParams, setSearchParams]);

  // Check for Stripe payment success on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentSuccess = queryParams.get('payment_success');
    const sessionId = queryParams.get('session_id');
    
    if (paymentSuccess === 'true') {
      // Show success message
      console.log('Payment successful! Session ID:', sessionId);
      
      // Redirect to Telegram with success message
      if (telegramUsername) {
        const successMessage = `🎉 **Payment Successful!** 🎉

✅ **Transaction ID:** ${sessionId || 'N/A'}
💰 **Amount:** $135.00
📦 **Package:** ALL CONTENT INCLUDED
⏰ **Time:** ${new Date().toLocaleString()}

Thank you for your purchase! You now have access to all content on the site.

Please let me know if you need any assistance accessing your content.`;
        
        const encoded = encodeURIComponent(successMessage);
        const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}?text=${encoded}`;
        
        // Open Telegram after a short delay
        setTimeout(() => {
          window.open(telegramUrl, '_blank');
        }, 2000);
      }
      
      // Clear query params
      window.history.replaceState({}, document.title, '/');
    }
  }, [telegramUsername]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadedVideos([]); // Reset loaded videos
        setVideos([]); // Reset videos array
        
        // Get IDs once and keep a randomized order for this page session.
        if (!shuffledVideoIdsRef.current) {
          const allVideoIds = await VideoService.getVideoIds(SortOption.NEWEST);
          shuffledVideoIdsRef.current = shuffleIds(allVideoIds);
        }

        const randomizedIds = shuffledVideoIdsRef.current || [];
        const totalPages = Math.ceil(randomizedIds.length / videosPerPage);
        setTotalPages(totalPages);
        
        // Get video IDs for current page
        const startIndex = (page - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
        const pageVideoIds = randomizedIds.slice(startIndex, endIndex);
        
        // Set loading to false immediately so skeletons show
        setLoading(false);
        
        // Load videos one by one, starting immediately
        loadVideosOneByOne(pageVideoIds);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVideos();
    
    // Sempre mostrar o botão de configuração (não dependemos mais do Appwrite)
    setShowSetupButton(false);
  }, [user, page]);

  // Animate small online counter (0-100) below the title
  useEffect(() => {
    const interval = setInterval(() => {
      setSectionOnlineNow(prev => {
        const delta = Math.floor(Math.random() * 12) - 5; // -5..+6
        const next = prev + delta;
        return Math.min(100, Math.max(0, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Function to load videos one by one (immediate first video)
  const loadVideosOneByOne = async (videoIds: string[]) => {
    setIsLoadingMore(true);
    
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      
      try {
        // Load individual video
        const video = await VideoService.getVideo(videoId);
        
        if (video) {
          // Add video immediately to both arrays
          setLoadedVideos(prev => [...prev, video]);
          setVideos(prev => [...prev, video]);
        }
        
        // Add a small delay between videos (except for the first one)
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      } catch (error) {
        console.error(`Error loading video ${videoId}:`, error);
        // Continue with next video even if current one fails
      }
    }
    
    setIsLoadingMore(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top with enhanced smooth behavior
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    // Show skeletons for videos that haven't loaded yet
    const totalExpectedVideos = videosPerPage;
    const loadedCount = loadedVideos.length;
    const skeletonCount = Math.max(0, totalExpectedVideos - loadedCount);
    
    return Array(skeletonCount).fill(0).map((_, index) => (
      <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
        <VideoCardSkeleton />
      </Grid>
    ));
  };

  // Render loading cards with progress indicators
  const renderLoadingCards = () => {
    // Show loading cards for videos that are currently being loaded
    const totalExpectedVideos = videosPerPage;
    const loadedCount = loadedVideos.length;
    const loadingCount = Math.max(0, totalExpectedVideos - loadedCount);
    
    return Array(loadingCount).fill(0).map((_, index) => (
      <Grid item key={`loading-${index}`} xs={12} sm={6} md={4} lg={3}>
        <VideoCardLoading index={loadedCount + index} />
      </Grid>
    ));
  };

  const handleBannerError = (errorMsg: string) => {
    setError(errorMsg);
  };

  

  return (
    <Box sx={{ 
      width: '100%',
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #020617 0%, #020c2a 100%)'
        : 'linear-gradient(180deg, rgba(250,250,252,1) 0%, rgba(255,255,255,1) 100%)'
    }}>
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
      
      {/* Banner de destaque */}
      <FeaturedBanner onError={handleBannerError} />
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Mensagem de cancelamento de pagamento com texto mais simples e menos técnico */}
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
              Your payment was cancelled. No charges were made and you can continue browsing the content normally.
            </Typography>
          </Alert>
        )}

        {/* Status das Credenciais */}
        <CredentialsStatus />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 3,
          mt: 2,
          p: 2,
          borderRadius: 2,
          background: theme => theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.02)',
          border: theme => `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{
                fontWeight: 800,
                background: theme => theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #fff 0%, #aaa 100%)'
                  : 'linear-gradient(90deg, #000 0%, #555 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {videoListTitle || 'Featured Videos'}
            </Typography>
            {!loading && videos.length > 0 && null}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            alignSelf: { xs: 'flex-start', md: 'center' }
          }}>
            {showSetupButton && (
              <Tooltip title="Configurar Armazenamento Wasabi">
                <Button
                  onClick={() => setSetupModalOpen(true)}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ 
                    minWidth: 'auto', 
                    px: 1.5,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}
            
            <Button 
              component={RouterLink}
              to="/videos"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
            >
              View All Videos
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setSetupModalOpen(true)}
                startIcon={<SettingsIcon />}
              >
                Configurar Base de Dados
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        <Fade in={true} timeout={500}>
          <Box>
            {loading ? (
              <Grid container spacing={3}>
                {renderSkeletons()}
              </Grid>
            ) : videos.length === 0 && !isLoadingMore ? (
              <Grow in={true} timeout={1000}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  No videos available at the moment. Please check back later.
                </Alert>
              </Grow>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                  {/* Show loaded videos with smooth animation */}
                  {loadedVideos.map((video, index) => (
                    <Grow
                      key={video.$id}
                      in={true}
                      timeout={200}
                    >
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <VideoCard video={video} />
                      </Grid>
                    </Grow>
                  ))}
                  
                  {/* Show loading cards with progress indicators for remaining videos */}
                  {isLoadingMore && renderLoadingCards()}
                </Grid>
                
                {totalPages > 1 && (
                  <Fade in={true} timeout={800}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 5,
                      pt: 3,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          '& .MuiPaginationItem-root': {
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.06)'
                            }
                          }
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Container>
      
      {/* Seções extras simplificadas para manter o foco nos vídeos */}
      <ContactSection />

      {/* Modal de setup da base de dados */}
      <DatabaseSetupModal 
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
      />
    </Box>
  );
};

export default Home;
