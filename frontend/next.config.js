/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
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
