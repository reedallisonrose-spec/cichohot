import type { FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { useSiteConfig } from '../context/SiteConfigContext';

const Privacy: FC = () => {
  const theme = useTheme();
  const { siteName } = useSiteConfig();
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ py: 6, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <PrivacyTipIcon 
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
            Privacy Policy
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

        {/* Privacy Content */}
        <Box sx={{ '& > *': { mb: 4 } }}>
          {/* Introduction */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Introduction
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              At {siteName}, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website and use our services. 
              Please read this privacy policy carefully.
            </Typography>
          </Box>

          {/* Section 1 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 2 }}>
              We may collect information about you in a variety of ways. The information we may collect includes:
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Personal Data
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              When you register or make a purchase, we may collect:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Email address</Typography></li>
              <li><Typography variant="body1">Payment information (processed securely by our payment providers)</Typography></li>
              <li><Typography variant="body1">Account credentials (encrypted)</Typography></li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Usage Data
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">IP address and browser type</Typography></li>
              <li><Typography variant="body1">Pages visited and time spent on site</Typography></li>
              <li><Typography variant="body1">Device information and operating system</Typography></li>
              <li><Typography variant="body1">Referring website addresses</Typography></li>
            </Box>
          </Box>

          {/* Section 2 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              We use the information we collect to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Process your transactions and manage your account</Typography></li>
              <li><Typography variant="body1">Deliver the content you have purchased</Typography></li>
              <li><Typography variant="body1">Respond to your inquiries and provide customer support</Typography></li>
              <li><Typography variant="body1">Improve our website and services</Typography></li>
              <li><Typography variant="body1">Detect and prevent fraud or abuse</Typography></li>
              <li><Typography variant="body1">Comply with legal obligations</Typography></li>
            </Box>
          </Box>

          {/* Section 3 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              3. Data Security
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              We implement industry-standard security measures to protect your personal information:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1"><strong>SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is encrypted using HTTPS</Typography></li>
              <li><Typography variant="body1"><strong>Secure Payment Processing:</strong> We use PCI-DSS compliant payment processors (Stripe, PayPal)</Typography></li>
              <li><Typography variant="body1"><strong>Password Protection:</strong> Passwords are encrypted using industry-standard hashing algorithms</Typography></li>
              <li><Typography variant="body1"><strong>Access Controls:</strong> Limited access to personal data by authorized personnel only</Typography></li>
              <li><Typography variant="body1"><strong>Regular Security Audits:</strong> We continuously monitor and update our security practices</Typography></li>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              4. Payment Information
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              We do NOT store your credit card information on our servers. All payment details are handled 
              directly by our certified payment processors (Stripe and PayPal), who are fully PCI-DSS compliant. 
              We only receive confirmation of successful payments without access to your financial data.
            </Typography>
          </Box>

          {/* Section 5 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              5. Disclosure of Your Information
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              We will NOT sell, rent, or share your personal information with third parties except in the 
              following circumstances:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1"><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist in operating our website (payment processors, hosting providers)</Typography></li>
              <li><Typography variant="body1"><strong>Legal Requirements:</strong> When required by law or to protect our rights</Typography></li>
              <li><Typography variant="body1"><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</Typography></li>
            </Box>
          </Box>

          {/* Section 6 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              6. Cookies and Tracking Technologies
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              We use cookies and similar tracking technologies to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1">Maintain your session and preferences</Typography></li>
              <li><Typography variant="body1">Analyze site traffic and usage patterns</Typography></li>
              <li><Typography variant="body1">Remember your login status</Typography></li>
            </Box>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mt: 2 }}>
              You can control cookies through your browser settings. However, disabling cookies may limit 
              some functionality of the site.
            </Typography>
          </Box>

          {/* Section 7 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              7. Your Privacy Rights
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1 }}>
              Depending on your location, you may have the following rights:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: theme.palette.text.secondary }}>
              <li><Typography variant="body1"><strong>Access:</strong> Request a copy of the personal data we hold about you</Typography></li>
              <li><Typography variant="body1"><strong>Correction:</strong> Request correction of inaccurate or incomplete data</Typography></li>
              <li><Typography variant="body1"><strong>Deletion:</strong> Request deletion of your personal data</Typography></li>
              <li><Typography variant="body1"><strong>Data Portability:</strong> Request transfer of your data to another service</Typography></li>
              <li><Typography variant="body1"><strong>Opt-out:</strong> Unsubscribe from marketing communications</Typography></li>
            </Box>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mt: 2 }}>
              To exercise these rights, please contact us through the support channels listed on our website.
            </Typography>
          </Box>

          {/* Section 8 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              8. Data Retention
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              We retain your personal information only for as long as necessary to provide you with our 
              services and as required by applicable laws. When data is no longer needed, we securely 
              delete or anonymize it.
            </Typography>
          </Box>

          {/* Section 9 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              9. Third-Party Websites
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices or content of these external sites. We encourage you to review their privacy policies.
            </Typography>
          </Box>

          {/* Section 10 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              10. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Our services are intended only for users 18 years of age or older. We do not knowingly collect 
              personal information from anyone under 18. If we discover that we have collected information 
              from a minor, we will promptly delete it.
            </Typography>
          </Box>

          {/* Section 11 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              11. International Data Transfers
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that appropriate safeguards are in place to protect your data in compliance 
              with applicable data protection laws.
            </Typography>
          </Box>

          {/* Section 12 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              12. Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date. We encourage you 
              to review this policy periodically.
            </Typography>
          </Box>

          {/* Section 13 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              13. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              If you have any questions about this Privacy Policy or our data practices, please contact us 
              through the support channels available on our website.
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
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}>
            Your Privacy is Our Priority
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
            We are committed to protecting your personal information and maintaining the confidentiality 
            of your interactions with {siteName}.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Privacy;

