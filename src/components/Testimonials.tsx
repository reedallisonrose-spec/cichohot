import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface Testimonial {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Michael R.',
    initials: 'MR',
    rating: 5,
    comment: 'Very discreet payment process and instant access. The quality is excellent and the site is professional.',
    date: 'December 2024'
  },
  {
    name: 'David S.',
    initials: 'DS',
    rating: 5,
    comment: 'Great selection and easy to use. Payment was secure and showed up discreetly on my statement as promised.',
    date: 'November 2024'
  },
  {
    name: 'James T.',
    initials: 'JT',
    rating: 5,
    comment: 'Premium content at fair prices. The SSL encryption and secure payment gave me confidence to purchase.',
    date: 'January 2025'
  },
  {
    name: 'Robert K.',
    initials: 'RK',
    rating: 4,
    comment: 'Good quality videos and reliable service. Customer support was helpful when I had a question.',
    date: 'December 2024'
  },
  {
    name: 'Thomas L.',
    initials: 'TL',
    rating: 5,
    comment: 'Fast, secure, and exactly what I was looking for. No issues with the payment or access to content.',
    date: 'January 2025'
  },
  {
    name: 'Christopher M.',
    initials: 'CM',
    rating: 5,
    comment: 'Excellent platform with top-notch security. The billing is discreet and the content is high quality.',
    date: 'November 2024'
  }
];

const Testimonials: FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          What Our Customers Say
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Trusted by thousands of satisfied customers worldwide
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {testimonials.map((testimonial, index) => (
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 24px rgba(0,0,0,0.4)' 
                    : '0 8px 24px rgba(0,0,0,0.12)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Quote Icon */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <FormatQuoteIcon 
                    sx={{ 
                      fontSize: 40,
                      color: theme.palette.primary.main,
                      opacity: 0.3
                    }} 
                  />
                </Box>

                {/* Rating */}
                <Box sx={{ mb: 2 }}>
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffa726',
                      }
                    }}
                  />
                </Box>

                {/* Comment */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                    mb: 3,
                    minHeight: '80px'
                  }}
                >
                  "{testimonial.comment}"
                </Typography>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {testimonial.initials}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {testimonial.date}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Trust Summary */}
      <Box 
        sx={{ 
          mt: 5, 
          p: 3,
          borderRadius: '12px',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(211,47,47,0.15) 0%, rgba(142,36,170,0.15) 100%)'
            : 'linear-gradient(135deg, rgba(211,47,47,0.08) 0%, rgba(142,36,170,0.08) 100%)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(211,47,47,0.3)'
            : '1px solid rgba(211,47,47,0.2)',
          textAlign: 'center'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              5,000+
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Satisfied Customers
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              4.8★
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Average Rating
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              99%
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Recommend Us
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Testimonials;

