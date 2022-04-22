// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Breadcrumb, Event as SentryEvent } from "@sentry/types";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

console.info("Sentry: initializing");
Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://c81a9ca0c7e347c79213e269128ebe2a@o1214507.ingest.sentry.io/6355162",
  tracesSampleRate: 1.0,

  beforeBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
    // Disable all UI-interaction breadcrumbs.
    // They inevitably will contain PHI.
    if (breadcrumb.category?.startsWith("ui.") || breadcrumb.type == "user") {
      return null;
    }

    // Filter navigation breadcrumbs, removing fragment
    if (breadcrumb.category == "navigation") {
      if (breadcrumb.data?.to) {
        breadcrumb.data.to = scrubFragment(breadcrumb.data.to);
      }
      if (breadcrumb.data?.from) {
        breadcrumb.data.from = scrubFragment(breadcrumb.data.from);
      }
    }

    return breadcrumb;
  },
});

Sentry.addGlobalEventProcessor((event: SentryEvent) => {
  // Scrub URL query fragments from event URLs
  if (event.request?.url) {
    event.request.url = scrubFragment(event.request.url);
  }

  // Scrub query fragments if they're explicitly recorded
  if (event.request) {
    // @ts-ignore 'fragment' is documented, but not in the types
    delete event.request?.fragment;
  }

  console.info("Sentry report", event);
  return event;
});

function scrubFragment(url: string): string {
  if (url.indexOf("#") != -1) {
    return url.split("#")[0];
  }

  return url;
}
