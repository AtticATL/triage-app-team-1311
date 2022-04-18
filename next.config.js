const withPwa = require("next-pwa");

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
};

nextConfig = withPwa(
  {
    pwa: { dest: "public", scope: "/" },
  },
  nextConfig
);

module.exports = nextConfig;
