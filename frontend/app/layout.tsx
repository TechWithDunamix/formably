import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Formably - Modern Form Builder",
  description: "Create beautiful forms with ease",
  icons:{
    icon:"/logo.svg"
  },
    robots: {
      index: true,
    },
  openGraph: {
    title: "Formably - Modern Form Builder",
    description: "Create beautiful forms with ease",
    url: "https://formably.v0.dev",
    siteName: "Formably",
    images: [
      {
        url: "https://formably.v0.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Formably - Modern Form Builder",
      },
    ],
  },
  twitter: {
    title: "Formably - Modern Form Builder",
    description: "Create beautiful forms with ease",
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
