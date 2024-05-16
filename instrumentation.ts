import * as Sentry from '@sentry/nextjs'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      enabled: process.env.VERCEL_ENV !== 'development',

      dsn: 'https://b33f06fd16bbb495c85d256ee5f32729@o4506369040187392.ingest.sentry.io/4506369042415616',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      spotlight: process.env.NODE_ENV === 'development',
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      enabled: process.env.VERCEL_ENV !== 'development',

      dsn: 'https://b33f06fd16bbb495c85d256ee5f32729@o4506369040187392.ingest.sentry.io/4506369042415616',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    })
  }
}
