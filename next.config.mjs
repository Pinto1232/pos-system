// next.config.mjs is not supported in ESM modules. Please use next.config.mjs instead.
import 'dotenv/config';

console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NEXT_PUBLIC_API_TOKEN:', process.env.NEXT_PUBLIC_API_TOKEN);

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  },
};

export default nextConfig;
