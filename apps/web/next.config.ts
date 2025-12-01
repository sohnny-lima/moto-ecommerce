import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Desactivar optimización de imágenes para desarrollo
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Suppress url.parse deprecation warning from Next.js internals
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

export default nextConfig;
