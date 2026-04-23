import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Fade, Grow } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import Collapse from '@mui/material/Collapse';
import Slider from '@mui/material/Slider';
import { Chip } from '@mui/material';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../services/Auth';
import VideoCard from '../components/VideoCard';
import { VideoService, Video, SortOption } from '../services/VideoService';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useDebounce } from '../hooks/useDebounce';
import ContactSection from '../components/ContactSection';

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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
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

const VideoList: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<Video[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NEWEST);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  
  const { user } = useAuth();
  const { siteConfig } = useSiteConfig();

  // Check if user has seen the adult content warning
  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('adult_content_warning_seen');
    if (!hasSeenWarning) {
      setShowAdultWarning(true);
    }
  }, []);

  // Update search query when URL params change
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    if (urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Function to load videos one by one (progressive loading)
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
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error loading video ${videoId}:`, error);
        // Continue with next video even if current one fails
      }
    }
    
    setIsLoadingMore(false);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadedVideos([]); // Reset loaded videos
        setVideos([]); // Reset videos array
        
        // Get video IDs first (ultra-fast operation - no metadata loading)
        const allVideoIds = await VideoService.getVideoIds(sortOption);
        
        // Apply search filter on IDs if needed
        let filteredIds = allVideoIds;
        if (debouncedSearchQuery) {
          // Load all videos first for search filtering
          const allVideos = await VideoService.getAllVideos(sortOption, debouncedSearchQuery);
          filteredIds = allVideos.map(v => v.$id);
        }
        
        // Set loading to false immediately so skeletons show
        setLoading(false);
        
        // Load videos one by one, starting immediately
        loadVideosOneByOne(filteredIds);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [user, sortOption, debouncedSearchQuery]);

  // Verificação periódica para limpar cache se necessário
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Verificar se há sinal para limpar cache
        const response = await fetch('/api/clear-cache', { method: 'POST' });
        if (response.ok) {
          console.log('Cache clear signal received, refreshing videos...');
          VideoService.clearCachePublic();
          // Recarregar vídeos
          const allVideos = await VideoService.getAllVideos(sortOption, debouncedSearchQuery);
          setVideos(allVideos);
        }
      } catch (error) {
        // Ignorar erros de rede
        console.log('Cache check failed:', error);
      }
    };

    // Verificar a cada 10 segundos
    const interval = setInterval(checkForUpdates, 10000);
    
    return () => clearInterval(interval);
  }, [sortOption, debouncedSearchQuery]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as SortOption);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle adult content warning acknowledgment
  const handleCloseAdultWarning = () => {
    localStorage.setItem('adult_content_warning_seen', 'true');
    setShowAdultWarning(false);
  };

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    return Array(12).fill(0).map((_, index) => (
      <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
        <VideoCardSkeleton />
      </Grid>
    ));
  };

  // Render loading cards with progress indicators
  const renderLoadingCards = () => {
    // Calculate how many cards to show based on typical result size
    const expectedTotal = 24; // Expected number of videos
    const loadedCount = loadedVideos.length;
    const loadingCount = Math.min(12, Math.max(0, expectedTotal - loadedCount));
    
    return Array(loadingCount).fill(0).map((_, index) => (
      <Grid item key={`loading-${index}`} xs={12} sm={6} md={4} lg={3}>
        <VideoCardLoading index={loadedCount + index} />
      </Grid>
    ));
  };

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      {/* Adult Content Warning Modal */}
      <Modal
        open={showAdultWarning}
        onClose={handleCloseAdultWarning}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-labelledby="adult-content-warning"
      >
        <Fade in={showAdultWarning}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '500px' },
            bgcolor: 'background.paper',
            border: '2px solid #f44336',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Adult Content Warning
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              This website contains adult material and is intended only for people 18 years of age or older.
              By clicking "Enter", you confirm that you are at least 18 years old and consent to viewing adult content.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => window.history.back()}
              >
                Exit
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCloseAdultWarning}
              >
                Enter (18+)
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      
      <Box 
        data-testid="search-section"
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 3
        }}>
        <Box>
          <Typography variant="subtitle1" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {siteConfig?.video_list_title || 'Available Videos'}
          </Typography>
          {!loading && loadedVideos.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {`Showing ${loadedVideos.length} video${loadedVideos.length !== 1 ? 's' : ''}`}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          width: { xs: '100%', md: 'auto' },
          mt: { xs: 2, md: 0 }
        }}>
          <TextField
            placeholder="Search videos..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: { xs: '100%', sm: '200px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: '150px' } }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortOption}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value={SortOption.NEWEST}>Newest</MenuItem>
              <MenuItem value={SortOption.PRICE_ASC}>Price: Low to High</MenuItem>
              <MenuItem value={SortOption.PRICE_DESC}>Price: High to Low</MenuItem>
              <MenuItem value={SortOption.VIEWS_DESC}>Most Viewed</MenuItem>
              <MenuItem value={SortOption.DURATION_DESC}>Longest</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {debouncedSearchQuery && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body1">
            Search results for: <strong>"{debouncedSearchQuery}"</strong>
          </Typography>
        </Paper>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box>
        {loading ? (
          <Grid container spacing={3}>
            {renderSkeletons()}
          </Grid>
        ) : loadedVideos.length === 0 && !isLoadingMore ? (
          <Grow in={true} timeout={1000}>
            <Paper sx={{ 
              p: 4, 
              my: 3, 
              textAlign: 'center',
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.02) 100%)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                No videos found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery 
                  ? `No videos matching "${searchQuery}". Try a different search term.` 
                  : (showFilters 
                    ? 'No videos match your current filters. Try adjusting your filter settings.' 
                    : 'No videos available at the moment. Please check back later.')}
              </Typography>
            </Paper>
          </Grow>
          ) : (
            <>
              <Grid container spacing={3}>
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
            </>
          )}
      </Box>
    </Container>
    
    <ContactSection />
    </>
  );
};

export default VideoList; 