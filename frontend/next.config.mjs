/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'akktlrlubvxhyqoz.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;
