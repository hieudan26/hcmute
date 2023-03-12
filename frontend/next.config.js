/** @type {import('next').NextConfig} */
const {
  i18n
} = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  env: {
    defaultAvatar: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
    defaultCoverBackground: process.env.NEXT_PUBLIC_DEFAULT_COVERBACKGROUND,
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    // disableStaticImages: false,
    minimumCacheTTL: 60,
    // dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['lumiere-s3.s3.ap-southeast-1.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
    remotePatterns: [{
      protocol: 'https',
      hostname: 'assets.vercel.com',
      // port: '',
      pathname: '/image/upload/**',
    }, ],
  },
  // async rewrites() {
  //   return [
  //       {
  //           source: '/profile/:userId/posts',
  //           destination: '/profile/:userId'
  //       }
  //   ];
  // },
};

module.exports = nextConfig;
// const StylelintPlugin = require("stylelint-webpack-plugin"); // line to add
// module.exports = {
//   reactStrictMode: true,
//   // lines to add
//   webpack: (config, options) => {
//     config.plugins.push(new StylelintPlugin());
//     return config;
//   },

// };
