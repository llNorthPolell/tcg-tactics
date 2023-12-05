import type { Metadata, Viewport } from 'next'
import { Roboto, Averia_Serif_Libre } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'

const font1 = Roboto({
  weight: ['100','300','400','500','700','900'],
  style: ['normal'],
  subsets:['latin'],
  display: 'swap',
})

const font2 = Averia_Serif_Libre({
  weight: ['300','400','700'],
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
      <body className={font2.className}>{children}</body>
    </html>
  )
}
