import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    remotePatterns: [
      
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
   async headers() {
    return [
      {
        source: '/team/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
