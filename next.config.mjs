/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    // images: {
    //     unoptimized: true, // Disable Image Optimization
    // },
    webpack(config) {
        return config;
    },
    reactStrictMode: true,
};

export default nextConfig;


