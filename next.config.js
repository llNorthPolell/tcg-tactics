/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '**'
            },
        ]
    },
    distDir: "out", //this line will tell the build to create a file with this name,
    output: "export"

}

module.exports = nextConfig
