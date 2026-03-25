import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorSpotlight from "@/components/CursorSpotlight";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.description,
    type: "website",
    url: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body
        className="relative min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white antialiased"
      >
        <a
          href="#main-content"
          className="sr-only z-[70] rounded-full border border-[color:var(--accent-soft)] bg-[#0a0d14] px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="site-background pointer-events-none fixed inset-0 -z-20" />
        <div className="site-grid pointer-events-none fixed inset-0 -z-10 opacity-60" />
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),radial-gradient(circle_at_18%_12%,rgba(142,236,255,0.04),transparent_18%)]" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_78%_82%,rgba(255,255,255,0.05),transparent_26%),radial-gradient(circle_at_24%_100%,rgba(142,236,255,0.03),transparent_32%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,4,8,0.02),rgba(2,4,8,0.22)_24%,rgba(2,4,8,0.92)_100%)]" />
        <CursorSpotlight />

        <Navbar siteSettings={siteSettings} />
        <main id="main-content" className="min-h-screen pt-24">
          {children}
        </main>
        <Footer siteSettings={siteSettings} />
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
