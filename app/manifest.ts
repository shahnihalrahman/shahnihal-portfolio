import type { MetadataRoute } from 'next';

import { seo, site } from '@/lib/site';

/**
 * Minimal web app manifest.
 *
 * This exists only so the portrait icon has a home-screen / installed-app
 * identity on Android and other manifest-aware surfaces — there is no other
 * PWA behaviour (no service worker, no offline support) and none is implied.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: site.name,
    description: seo.description,
    start_url: '/',
    display: 'browser',
    background_color: '#04060B',
    theme_color: '#04060B',
    icons: [
      {
        // Served automatically at this path by Next's file-based icon
        // convention (app/icon.png) — no separate copy kept under /public.
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
