import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    template: "%s | Raghavendra Portfolio",
    default: "Raghavendra | Backend Engineer & Student",
  },
  description: "Portfolio of Raghavendra, a Computer Science student at BITS Pilani & Scaler School of Technology.",
  keywords: ["Raghavendra", "Portfolio", "Backend Engineer", "Next.js", "BITS Pilani", "Scaler"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex flex-col min-h-screen font-sans antialiased text-gray-900 bg-white">
        <Navbar />
        {/* We add padding-top to body content so it isn't hidden behind the fixed Navbar */}
        <div className="flex-1 pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}