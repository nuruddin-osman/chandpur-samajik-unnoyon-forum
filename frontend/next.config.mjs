/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: "http://localhost:5000/assets/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
