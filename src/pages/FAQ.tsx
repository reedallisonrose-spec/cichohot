import type { FC } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface FAQItem {
  question: string;
  answer: string;
  category: 'payment' | 'security' | 'access' | 'support';
}

const faqData: FAQItem[] = [
  {
    question: 'How does payment work?',
    answer: 'We use industry-standard payment processors (Whop and PayPal) to ensure secure transactions. All payments are encrypted and processed through secure channels. Your financial information is never stored on our servers.',
    category: 'payment'
  },
  {
    question: 'Is my payment discreet?',
    answer: 'Yes, absolutely. Your purchase will appear on your statement with a generic descriptor (like "Digital Content Purchase" or similar), not the actual site name. We understand the importance of privacy and discretion.',
    category: 'payment'
  },
  {
    question: 'Are my personal data safe?',
    answer: 'Yes. We take data security very seriously. All data is encrypted using SSL/TLS protocols. We follow GDPR guidelines and never sell or share your personal information with third parties. Your privacy is our priority.',
    category: 'security'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Due to the nature of digital content, all sales are final once you have accessed the purchased content. However, if you experience technical issues preventing access, please contact our support team within 48 hours of purchase.',
    category: 'payment'
  },
  {
    question: 'How do I access the content after purchase?',
    answer: 'Immediately after successful payment, you will be redirected to a secure page where you can view your purchased content. You can access it anytime by logging into your account.',
    category: 'access'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through Stripe, as well as PayPal. We may also accept cryptocurrency payments depending on your region.',
    category: 'payment'
  },
  {
    question: 'Is the site secure?',
    answer: 'Yes. Our website uses HTTPS encryption (SSL certificate) to protect all data transmitted between your browser and our servers. Look for the padlock icon in your browser\'s address bar as confirmation.',
    category: 'security'
  },
  {
    question: 'Do you store my credit card information?',
    answer: 'No. We never store your credit card information on our servers. All payment details are handled directly by our certified payment processors (Stripe/PayPal), who are PCI-DSS compliant.',
    category: 'security'
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach our support team via Telegram (see contact information in the footer). We typically respond within 24 hours during business days.',
    category: 'support'
  },
  {
    question: 'Can I cancel my purchase?',
    answer: 'Once you have accessed the digital content, purchases cannot be canceled. If you haven\'t accessed the content yet and need to cancel, please contact support immediately.',
    category: 'payment'
  },
  {
    question: 'Are all models verified to be of legal age?',
    answer: 'Yes. All models and performers featured on our platform are verified to be at least 18 years of age at the time of production. We maintain strict compliance with USC 2257 record-keeping requirements.',
    category: 'security'
  },
  {
    question: 'How long do I have access to purchased content?',
    answer: 'Once purchased, you have unlimited access to your content. There are no time limits or expiration dates on your purchases.',
    category: 'access'
  }
];

const FAQ: FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <PaymentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />;
      case 'security':
        return <SecurityIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />;
      case 'access':
        return <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />;
      case 'support':
        return <SupportAgentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />;
      default:
        return <HelpOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />;
    }
  };

  return (
    <Box sx={{ py: 6, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <HelpOutlineIcon 
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
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Find answers to common questions about payments, security, and access
          </Typography>
        </Box>

        {/* FAQ Sections */}
        <Box>
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 2px 8px rgba(0,0,0,0.3)' 
                  : '0 2px 8px rgba(0,0,0,0.08)',
                background: theme.palette.mode === 'dark'
                  ? 'rgba(26,26,26,0.8)'
                  : 'rgba(255,255,255,0.9)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderRadius: '12px',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(faq.category)}
                  <Typography sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact Section */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 4,
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
          <SupportAgentIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Our support team is here to help you.
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Contact us via Telegram for assistance
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;

