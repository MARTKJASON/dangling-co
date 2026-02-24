// next.config.js (or next.config.ts) — add the images block
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Replace YOUR_PROJECT_REF with your actual Supabase project ref
        // e.g. "abcdefghijklmnop.supabase.co"
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Serve modern WebP/AVIF format — biggest single win for load time
    formats: ['image/avif', 'image/webp'],
    // Cache optimised images for 7 days
    minimumCacheTTL: 604800,
  },
};

module.exports = nextConfig;