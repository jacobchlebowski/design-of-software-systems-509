/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,  // Add this line
    },
};

export default nextConfig;

