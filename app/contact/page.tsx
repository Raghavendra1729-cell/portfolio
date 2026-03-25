import type { Metadata } from "next";
import { Github, Linkedin, Mail, MessageSquareMore } from "lucide-react";
import { RevealSection } from "@/components/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import PageShell from "@/components/layout/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/metadata";

const contactMethods = [
  {
    label: "Email",
    value: siteConfig.emailLabel,
    href: siteConfig.emailHref,
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn profile",
    href: siteConfig.linkedinHref,
    icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "GitHub profile",
    href: siteConfig.githubHref,
    icon: Github,
  },
] as const;


export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Direct contact methods for opportunities and collaboration.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Contact."
        description="Use any of the methods below."
      />

      <section className="grid gap-6 md:grid-cols-3">
        {contactMethods.map(({ label, value, href, icon: Icon }, index) => (
          <RevealSection key={label} delay={index * 0.04}>
            <article className="command-surface command-outline flex h-full flex-col rounded-[2rem] p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/16 bg-cyan-300/10 text-cyan-100">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">{label}</h2>
              <p className="mt-2 text-sm text-slate-300">{value}</p>

              <MagneticButton
                asChild
                wrapperClassName="mt-6"
                className="w-full justify-center border-white/12 bg-white/6 px-4 py-3 text-white"
              >
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  Open
                  <MessageSquareMore className="h-4 w-4" />
                </a>
              </MagneticButton>
            </article>
          </RevealSection>
        ))}
      </section>
    </PageShell>
  );
}