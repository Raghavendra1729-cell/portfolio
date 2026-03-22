"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/site-config";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const socials = [
    { href: siteConfig.githubHref, icon: Github, label: "GitHub" },
    { href: siteConfig.linkedinHref, icon: Linkedin, label: "LinkedIn" },
    { href: siteConfig.emailHref, icon: Mail, label: "Email" },
  ];

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative border-t border-white/5 mt-auto">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-bold text-xl text-white">
              {siteConfig.name}<span className="gradient-text">.</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {siteConfig.role}
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            {publicNavItems.filter((item) => item.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-600 flex justify-center gap-4">
        <span>© {currentYear} All rights reserved.</span>
        <Link href="/contact" className="hover:text-slate-400 transition">
          Contact
        </Link>
      </div>
    </footer>
  );
}
