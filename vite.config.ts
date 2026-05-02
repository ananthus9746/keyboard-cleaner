import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

const DEV_FALLBACK_SITE = 'http://localhost:5173'

/** Mirrors index.html keywords for structured data (comma-separated). */
const SEO_KEYWORDS =
  'keyboard cleaner, online keyboard cleaner, laptop keyboard cleaner, lock keyboard while cleaning, disable keyboard temporarily, browser keyboard lock, Mac keyboard cleaner, Windows keyboard cleaner, clean keyboard without typing, keyboard dust crumbs'

function seoPlugin(mode: string, env: Record<string, string>): Plugin {
  return {
    name: 'seo-site-url-and-jsonld',
    transformIndexHtml(html) {
      let siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
      if (!siteUrl && mode === 'development') {
        siteUrl = DEV_FALLBACK_SITE
      }

      let out = html

      if (!siteUrl) {
        out = out
          .replace(/\s*<link rel="canonical"[^>]*>\s*/gi, '\n')
          .replace(/\s*<meta property="og:url"[^>]*>\s*/gi, '\n')
          .replace(/\s*<meta name="twitter:url"[^>]*>\s*/gi, '\n')
          .replace(/\s*<link rel="alternate"[^>]*>\s*/gi, '\n')
      } else {
        out = out.replaceAll('%SITE_URL%', siteUrl)
      }

      const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Online Keyboard Cleaner',
        alternateName: 'Browser keyboard lock for cleaning',
        description:
          'Free online keyboard cleaner: absorb keystrokes in the browser while you wipe laptop or desktop keys—helps when you want to clean a keyboard without typing into apps. Works on macOS and Windows; offline after load; privacy-friendly.',
        keywords: SEO_KEYWORDS,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Windows, macOS, Linux',
        browserRequirements: 'Requires JavaScript.',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: 'Ananthu',
          url: 'https://ananthu.onrender.com/',
        },
      }
      if (siteUrl) {
        jsonLd.url = `${siteUrl}/`
      }

      const jsonStr = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
      const script = `\n    <script type="application/ld+json">${jsonStr}</script>`
      out = out.replace('</head>', `${script}\n  </head>`)

      return out
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), seoPlugin(mode, env)],
  }
})
