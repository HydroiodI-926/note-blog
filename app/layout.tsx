import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { BackgroundProvider } from '@/components/providers/BackgroundProvider'
import BackgroundRenderer from '@/components/BackgroundRenderer'
import { AudioProvider } from '@/components/audio/AudioProvider'
import { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import HomeSidebar from '@/components/home/HomeSidebar'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
        <link
          rel="mask-icon"
          href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('theme-color');if(c){var p={'rose':{'--color-primary-400':'oklch(0.718 0.202 349.761)','--color-primary-500':'oklch(0.656 0.241 354.308)','--color-primary-600':'oklch(0.592 0.249 0.584)'},'violet':{'--color-primary-400':'oklch(0.627 0.265 303.9)','--color-primary-500':'oklch(0.541 0.281 293.009)','--color-primary-600':'oklch(0.491 0.270 292.581)'},'blue':{'--color-primary-400':'oklch(0.623 0.214 259.815)','--color-primary-500':'oklch(0.546 0.245 262.881)','--color-primary-600':'oklch(0.488 0.243 264.376)'},'cyan':{'--color-primary-400':'oklch(0.789 0.154 211.53)','--color-primary-500':'oklch(0.715 0.143 215.221)','--color-primary-600':'oklch(0.609 0.126 221.723)'},'teal':{'--color-primary-400':'oklch(0.704 0.172 171.31)','--color-primary-500':'oklch(0.637 0.168 170.714)','--color-primary-600':'oklch(0.542 0.146 172.114)'},'amber':{'--color-primary-400':'oklch(0.823 0.174 75.35)','--color-primary-500':'oklch(0.769 0.188 70.08)','--color-primary-600':'oklch(0.666 0.169 53.813)'},'orange':{'--color-primary-400':'oklch(0.783 0.184 57.70)','--color-primary-500':'oklch(0.705 0.213 47.604)','--color-primary-600':'oklch(0.646 0.207 41.116)'}};var v=p[c];if(v){var r=document.documentElement;for(var k in v)r.style.setProperty(k,v[k])}}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-transparent text-black antialiased dark:text-white">
        <ThemeProviders>
          <AudioProvider>
            <BackgroundProvider>
              <BackgroundRenderer />
              <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
              <div className="relative">
                <SectionContainer>
                  <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                    <Header />
                    <main className="mb-auto">
                      <PageTransition>{children}</PageTransition>
                    </main>
                  </SearchProvider>
                  <Footer />
                </SectionContainer>
                <HomeSidebar />
              </div>
            </BackgroundProvider>
          </AudioProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
