import { FC } from 'react';
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import TelegramIcon from '@mui/icons-material/Telegram';

interface ChatButtonProps {
  telegramUrl?: string;
  zangiUrl?: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: any;
}

const ChatButton: FC<ChatButtonProps> = ({ 
  telegramUrl, 
  zangiUrl = 'https://services.zangi.com/dl/conversation/5222074953',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  sx = {}
}) => {
  const handleTelegramClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (telegramUrl) {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      startIcon={<TelegramIcon />}
      onClick={handleTelegramClick}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        ...sx,
      }}
      disabled={!telegramUrl}
    >
      Chat on Telegram
    </Button>
  );
};

export default ChatButton;
