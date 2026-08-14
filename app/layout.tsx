import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Sora } from 'next/font/google';

import { seo, site } from '@/lib/site';

import './globals.css';

const display = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.title,
    template: `%s — ${site.name}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  applicationName: `${site.name} — Portfolio`,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: seo.title,
    title: seo.title,
    description: seo.description,
    url: '/',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#04060B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  description: seo.description,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  knowsAbout: [
    'Applied AI',
    'AI-assisted development',
    'Web application development',
    'Digital product management',
    'UX design',
    'Workflow automation',
    'Next.js',
    'React',
    'SEO',
    'Analytics',
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Techno India University, Kolkata' },
    { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Delhi' },
  ],
  worksFor: { '@type': 'Organization', name: 'Truepost India Pvt. Ltd.' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-void text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[200] focus:rounded-full focus:bg-accent-cyan focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD. No user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
