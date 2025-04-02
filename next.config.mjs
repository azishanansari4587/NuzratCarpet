/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "res.cloudinary.com",
            },
        ],      
        unoptimized: true, // Disable Image Optimization
    },
    webpack(config) {
        return config;
    },
    reactStrictMode: true,
};

export default nextConfig;


