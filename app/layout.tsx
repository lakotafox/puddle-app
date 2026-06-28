import type React from "react"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Puddle - Real-Time Payroll Platform",
  description:
    "Revolutionary wage streaming platform that gives hourly workers instant access to their earned wages.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
