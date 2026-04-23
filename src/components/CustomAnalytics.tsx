import type { FC } from 'react';
import { Analytics } from '@vercel/analytics/react';

const CustomAnalytics: FC = () => {
  // Render Vercel Analytics; it is a no-op locally and activates on Vercel
  return <Analytics />;
};

export default CustomAnalytics; 