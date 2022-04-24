const withPwa = require("next-pwa");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,

  // Note: Sentry plugin isn't involved at all if the auth token env var isn't set
  sentry: {
    // Hide sourcemaps from the client
    hideSourceMaps: true,
  },
};

// Use next-pwa
nextConfig = withPwa(
  {
    pwa: { dest: "public", scope: "/" },
  },
  nextConfig
);

// Use Sentry, uploading sourcemaps
if (process.env.SENTRY_DO_RELEASE) {
  nextConfig = withSentryConfig(nextConfig, {
    silent: true, // Suppresses all logs
  });
}

module.exports = nextConfig;
