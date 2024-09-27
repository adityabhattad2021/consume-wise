/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'akktlrlubvxhyqoz.public.blob.vercel-storage.com',
                port: '',
            },
            {
                protocol:'https',
                hostname:'picsum.photos',
                port:''
            },
            {
                protocol:'https',
                hostname:'loremflickr.com',
                port:''
            },
            {
                protocol:'https',
                hostname:'lh3.googleusercontent.com',
                port:''
            }
        ],
    },
};

export default nextConfig;
