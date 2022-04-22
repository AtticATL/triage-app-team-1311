const withPwa = require("next-pwa");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
};

// Use next-pwa
nextConfig = withPwa(
  {
    pwa: { dest: "public", scope: "/" },
  },
  nextConfig
);

// Use Sentry, uploading sourcemaps
nextConfig = withSentryConfig(nextConfig, {
  silent: true, // Suppresses all logs
});

module.exports = nextConfig;
