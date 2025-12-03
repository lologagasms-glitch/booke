// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withWorkflow } from 'workflow/next';
const nextConfig: NextConfig = {
  
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard pour autoriser tous les domaines HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Wildcard pour autoriser tous les domaines HTTP (déconseillé en prod)
      },
    ],
  },
 
};

const withNextIntl = createNextIntlPlugin();
export default withWorkflow(withNextIntl(nextConfig));