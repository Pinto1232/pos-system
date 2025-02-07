/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true, 
  },
  transpilePackages: ["next-auth"], 
};

export default nextConfig;
