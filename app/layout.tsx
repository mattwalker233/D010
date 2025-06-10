import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import SiteHeader from '@/components/site-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Division Orderly',
  description: 'Manage and process division orders efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
} 