/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // output: 'export',
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
};

module.exports = nextConfig;
