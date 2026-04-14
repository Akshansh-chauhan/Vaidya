import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Vaidya - Your AI Health Companion",
  description:
    "Advanced AI-powered health assistant for posture analysis, dermatology scans, ophthalmology checks, and mental health screening.",
  generator: "Vaidya",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${outfit.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 animate-pulse" />
            </div>
          }>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
