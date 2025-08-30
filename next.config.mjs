/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Gunakan remotePatterns untuk konfigurasi gambar.
    // Ini menggantikan images.domains yang sudah deprecated.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:id(\\d+)/:slug',
        destination: '/movie/:id/:slug',
      },
    ];
  },
};

module.exports = nextConfig;
