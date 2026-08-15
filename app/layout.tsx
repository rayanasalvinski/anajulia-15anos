import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google'
import './globals.css'
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
export const metadata: Metadata = {
  title: 'Meus 15 Anos - Ana Julia',
  description: 'Convite para os 15 anos de Ana Julia - 10 de outubro de 2026, às 19h',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Meus 15 Anos - Ana Julia',
    description: 'Convite para os 15 anos de Ana Julia - 10 de outubro de 2026, às 19h',
    images: [
      {
        url: 'https://ana-julia15anos.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Convite 15 anos Ana Julia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meus 15 Anos - Ana Julia',
    description: 'Convite para os 15 anos de Ana Julia - 10 de outubro de 2026, às 19h',
    images: ['https://ana-julia15anos.vercel.app/og-image.png'],
  },
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#d6006e',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${greatVibes.variable} ${montserrat.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
