/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },
  transpilePackages: ["next-auth"],
};

export default nextConfig;
