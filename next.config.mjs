// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'standalone',
//     images: {
//         remotePatterns: [
//             {
//               protocol: "https",
//               hostname: "res.cloudinary.com",
//             },
//         ],      
//         unoptimized: true, // Disable Image Optimization
//     },
//     webpack(config) {
//         return config;
//     },
//     reactStrictMode: true,
// };

// export default nextConfig;


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
        unoptimized: true, 
    },
    // ✅ Webpack function hata diya kyunki ye khali tha
    // Isse Turbopack by default activate ho jayega
    reactStrictMode: true,
};

export default nextConfig;