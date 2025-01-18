module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty if no specific port is required
        pathname: '/dscuqewel/image/upload/**', // Matches Cloudinary image paths
      },
    ],
  },
};
