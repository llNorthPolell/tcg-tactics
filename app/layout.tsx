import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'

const roboto = Roboto({
  weight: ['100','300','400','500','700','900'],
  style: ['normal'],
  subsets:['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TCG-Tactics',
  description: 'Tactics-Card Game',
  icons: {
      icon: "/favicon.ico"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <Script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser-arcade-physics.min.js"></Script>
      </Head>
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
