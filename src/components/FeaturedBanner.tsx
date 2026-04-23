import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { VideoService, Video } from '../services/VideoService';
import { Chip } from '@mui/material';

interface FeaturedBannerProps {
  onError?: (error: string) => void;
}

const FeaturedBanner = ({ onError }: FeaturedBannerProps) => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(300); // 5 minutes = 300 seconds

  // Function to calculate time until next change based on global timestamp
  const calculateTimeUntilNext = () => {
    const now = Date.now();
    const intervalMs = 5 * 60 * 1000; // 5 minutes in milliseconds
    const timeSinceLastChange = now % intervalMs;
    const timeUntilNextChange = intervalMs - timeSinceLastChange;
    return Math.ceil(timeUntilNextChange / 1000); // Convert to seconds
  };

  // Function to get a deterministic video based on current time interval
  const getVideoForCurrentInterval = (videos: Video[]) => {
    if (videos.length === 0) return null;
    
    const now = Date.now();
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const currentInterval = Math.floor(now / intervalMs);
    
    // Use the interval number as seed for deterministic selection
    const videoIndex = currentInterval % videos.length;
    return videos[videoIndex];
  };

  // Function to fetch a video for current time interval
  const fetchVideoForCurrentInterval = async (isTransition = false) => {
    try {
      if (isTransition) {
        setIsTransitioning(true);
      } else {
        setLoading(true);
      }
      
      // If we don't have videos yet, fetch them
      if (allVideos.length === 0) {
        const videos = await VideoService.getAllVideos();
        setAllVideos(videos);
        
        if (videos.length > 0) {
          // Select video based on current time interval
          const selectedVideo = getVideoForCurrentInterval(videos);
          if (selectedVideo) {
            setFeaturedVideo(selectedVideo);
          }
        }
      } else {
        // Use existing videos to select based on current interval
        const selectedVideo = getVideoForCurrentInterval(allVideos);
        if (selectedVideo) {
          setFeaturedVideo(selectedVideo);
        }
      }
    } catch (error) {
      console.error('Error fetching featured video:', error);
      if (onError) {
        onError('Failed to load featured content');
      }
    } finally {
      setLoading(false);
      if (isTransition) {
        // Add a small delay for smooth transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }
    }
  };

  useEffect(() => {
    // Initial load
    fetchVideoForCurrentInterval();
    
    // Set initial countdown
    setTimeUntilNext(calculateTimeUntilNext());
  }, []);

  // Set up interval to change video every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (allVideos.length > 0) {
        fetchVideoForCurrentInterval(true); // Pass true to indicate this is a transition
        setTimeUntilNext(calculateTimeUntilNext()); // Reset countdown based on global time
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [allVideos.length]);

  // Countdown timer that syncs with global time
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilNext());
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Temporarily disabled
  return null;

  // Extract only what we need from the description (first 150 characters)
  const truncatedDescription = featuredVideo.description.length > 150 
    ? `${featuredVideo.description.substring(0, 150)}...` 
    : featuredVideo.description;

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        width: '100%',
        overflow: 'hidden',
        mb: 4,
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {/* Age verification banner */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <WarningIcon sx={{ color: theme => theme.palette.primary.main }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          18+ ADULT CONTENT • By continuing, you confirm you are at least 18 years old
        </Typography>
      </Box>

      {/* Auto-change indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: theme => theme.palette.primary.main,
          color: 'white',
          padding: '8px 12px',
          zIndex: 3,
          borderRadius: '0 0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isTransitioning ? '#FFD700' : '#00FF00',
            animation: isTransitioning ? 'pulse 1s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
          {isTransitioning ? 'CHANGING...' : `NEXT IN ${Math.floor(timeUntilNext / 60)}:${(timeUntilNext % 60).toString().padStart(2, '0')}`}
        </Typography>
      </Box>

      {/* Background image (thumbnail) with gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${featuredVideo.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.85)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,15,80,0.15) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }
        }}
      />

      {/* Banner content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          width: '100%',
          padding: { xs: '0 5%', md: '0 10%' },
          zIndex: 2,
        }}
      >
        <Chip 
          label="FEATURED EXCLUSIVE" 
          color="primary"
          sx={{ 
            mb: 2, 
            fontWeight: 'bold', 
            backgroundColor: theme => theme.palette.primary.main,
            '& .MuiChip-label': { px: 1, py: 0.5 }
          }} 
        />

        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            mb: 2,
          }}
        >
          {featuredVideo.title}
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'white', 
            maxWidth: { xs: '100%', md: '50%' },
            mb: 3,
            textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
            fontSize: '1.1rem',
          }}
        >
          {truncatedDescription}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to={`/video/${featuredVideo.$id}`}
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            sx={{
              bgcolor: theme => theme.palette.primary.main,
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#D10D42',
                transform: 'scale(1.03)',
              },
              px: 4,
              py: 1.2,
              borderRadius: '8px',
            }}
          >
            Watch Now
          </Button>
          
          <Button
            component={Link}
            to={`/video/${featuredVideo.$id}`}
            variant="contained"
            size="large"
            startIcon={<InfoIcon />}
            sx={{
              bgcolor: 'rgba(25, 25, 25, 0.8)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(25, 25, 25, 0.95)',
                transform: 'scale(1.03)',
              },
              px: 4,
              py: 1.2,
              borderRadius: '8px',
            }}
          >
            More Info
          </Button>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              display: 'inline-block',
              border: theme => `1px solid ${theme.palette.primary.main}`,
              bgcolor: theme => (theme.palette.mode === 'dark' ? 'rgba(13,71,161,0.18)' : 'rgba(13,71,161,0.10)'),
              px: 1.5,
              py: 0.5,
              borderRadius: '4px',
            }}
          >
            18+ ADULTS ONLY
          </Typography>
          
          {/* Enhanced price display */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: theme => theme.palette.primary.main,
            px: 2,
            py: 1,
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              ${featuredVideo.price.toFixed(2)}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            >
              ONE-TIME
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(25, 25, 25, 0.7)',
              px: 1,
              py: 0.5,
              borderRadius: '4px',
            }}
          >
            {featuredVideo.duration}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedBanner; 