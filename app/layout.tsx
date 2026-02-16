import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import "./globals.css"

const geist = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "./fonts/Geist-latin-variable.woff2", weight: "100 900", style: "normal" },
  ],
})

const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [
    { path: "./fonts/GeistMono-latin-variable.woff2", weight: "100 900", style: "normal" },
  ],
})

export const metadata: Metadata = {
  title: "Symphony研修プログラム | ファブリカホールディングス",
  description: "新卒からマネージャーまで、体系的に学べる営業力強化プログラム。全100本のミニ研修で即戦力を育成。",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
