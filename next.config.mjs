/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
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


