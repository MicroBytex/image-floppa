
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Add your Supabase storage URL or other image sources here if needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'your-supabase-id.supabase.co',
      // },
    ],
  },
};

export default nextConfig;
