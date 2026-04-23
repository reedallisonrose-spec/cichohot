import type { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import GavelIcon from '@mui/icons-material/Gavel';
import { useSiteConfig } from '../context/SiteConfigContext';

const Terms: FC = () => {
  const theme = useTheme();
  const { siteName } = useSiteConfig();
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ py: 6, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <GavelIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.primary.main,
              mb: 2 
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Terms of Service
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary
            }}
          >
            Last Updated: {currentDate}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Terms Content */}
        <Box sx={{ '& > *': { mb: 4 } }}>
          {/* Section 1 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              By accessing and using {siteName}, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to these Terms of Service, you should not access or use 
              this website.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              2. Age Requirement
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              You must be at least 18 years of age to access this website. By using this site, you represent 
              and warrant that you are at least 18 years old and have the legal capacity to enter into this 
              agreement. Access by minors is strictly prohibited.
            </Typography>
          </Box>

          {/* Section 3 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              3. Account and Registration
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. You are responsible for:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Maintaining the confidentiality of your account credentials</Typography></li>
              <li><Typography variant="body1">All activities that occur under your account</Typography></li>
              <li><Typography variant="body1">Notifying us immediately of any unauthorized use</Typography></li>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              4. Payments and Refunds
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              All purchases made on {siteName} are subject to the following terms:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">All prices are listed in USD and are subject to change</Typography></li>
              <li><Typography variant="body1">Payment must be made through our authorized payment processors</Typography></li>
              <li><Typography variant="body1">All sales are final once you have accessed the purchased content</Typography></li>
              <li><Typography variant="body1">Refunds may be considered only in cases of technical failure preventing access</Typography></li>
              <li><Typography variant="body1">Refund requests must be submitted within 48 hours of purchase</Typography></li>
            </Box>
          </Box>

          {/* Section 5 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              5. Content License and Restrictions
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              When you purchase content from {siteName}, you receive a limited, non-exclusive, 
              non-transferable license for personal use only. You agree NOT to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Download, reproduce, or distribute the content</Typography></li>
              <li><Typography variant="body1">Share your account access with others</Typography></li>
              <li><Typography variant="body1">Use the content for any commercial purpose</Typography></li>
              <li><Typography variant="body1">Reverse engineer or attempt to extract source files</Typography></li>
              <li><Typography variant="body1">Remove any copyright or proprietary notices</Typography></li>
            </Box>
          </Box>

          {/* Section 6 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              6. Privacy and Data Protection
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your personal information. By using this site, you consent to the collection and use of your 
              information as described in our Privacy Policy.
            </Typography>
          </Box>

          {/* Section 7 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              7. Prohibited Conduct
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              You agree not to engage in any of the following prohibited activities:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Attempting to gain unauthorized access to our systems</Typography></li>
              <li><Typography variant="body1">Using automated systems to access the site (bots, scrapers)</Typography></li>
              <li><Typography variant="body1">Harassing, threatening, or impersonating others</Typography></li>
              <li><Typography variant="body1">Uploading viruses or malicious code</Typography></li>
              <li><Typography variant="body1">Attempting to circumvent payment systems</Typography></li>
            </Box>
          </Box>

          {/* Section 8 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              8. Disclaimer of Warranties
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              This website and all content are provided "as is" without warranties of any kind, either express 
              or implied. We do not warrant that the site will be uninterrupted, error-free, or free from 
              viruses or other harmful components.
            </Typography>
          </Box>

          {/* Section 9 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              9. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              To the fullest extent permitted by law, {siteName} shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use or inability 
              to use the service.
            </Typography>
          </Box>

          {/* Section 10 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              10. Termination
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              We reserve the right to terminate or suspend your account and access to the site immediately, 
              without prior notice or liability, for any reason, including breach of these Terms.
            </Typography>
          </Box>

          {/* Section 11 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              11. Changes to Terms
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the site after changes constitutes acceptance of the new Terms.
            </Typography>
          </Box>

          {/* Section 12 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              12. Contact Information
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              If you have any questions about these Terms of Service, please contact us through the support 
              channels listed on our website.
            </Typography>
          </Box>
        </Box>

        {/* Footer Note */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 3,
            borderRadius: '8px',
            background: theme.palette.mode === 'dark'
              ? 'rgba(211,47,47,0.1)'
              : 'rgba(211,47,47,0.05)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(211,47,47,0.3)'
              : '1px solid rgba(211,47,47,0.2)',
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
            By using {siteName}, you acknowledge that you have read, understood, and agree to be bound 
            by these Terms of Service.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Terms;

