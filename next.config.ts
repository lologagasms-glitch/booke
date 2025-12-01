// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withWorkflow } from 'workflow/next';
const nextConfig: NextConfig = {
  images: {
   domains: [
      'images.pexels.com',
      'upload.wikimedia.org',
      'www.hilton.com',
      'www.ihg.com',
      'www.hyatt.com',
      'www.melia.com',
      'www.nh-hotels.com',
      'www.radissonhotels.com',
      'www.louvrehotels.com',
      'www.scandichotels.com',
      'www.kempinski.com',
      'www.marriott.com',
      'www.accor.com',
      'www.premierinn.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // <-- nouvelle entrée
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withWorkflow(withNextIntl(nextConfig));