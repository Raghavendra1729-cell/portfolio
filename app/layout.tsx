import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  title: {
    default: "Raghavendra | Software Engineer",
    template: "%s | Raghavendra",
  },
  description:
    "Portfolio of Raghavendra, a software engineer and student focused on adaptable problem solving, strong execution, and clear product-minded engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body
        className="relative min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white antialiased"
      >
        <div className="site-background pointer-events-none fixed inset-0 -z-20" />
        <div className="site-grid pointer-events-none fixed inset-0 -z-10 opacity-60" />
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_18%_12%,rgba(217,70,239,0.14),transparent_20%)]" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_78%_82%,rgba(16,185,129,0.14),transparent_26%),radial-gradient(circle_at_30%_100%,rgba(34,211,238,0.12),transparent_32%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.38)_24%,rgba(2,6,23,0.88)_100%)]" />

        <Navbar />
        <main className="min-h-screen pt-24">{children}</main>
        <Footer />
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
