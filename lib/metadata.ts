import { cache } from "react";
import type { Metadata } from "next";
import { getLandingPage, getSiteSettings } from "@/lib/data";
import type { SitePageKey } from "@/lib/site-content";

function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const productionUrl =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deploymentUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL;

  if (explicitUrl) {
    return explicitUrl;
  }

  if (productionUrl) {
    return `https://${productionUrl}`;
  }

  if (deploymentUrl) {
    return `https://${deploymentUrl}`;
  }

  return "http://localhost:3000";
}

const siteUrl = getSiteUrl();

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const getRootMetadata = cache(async (): Promise<Metadata> => {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings.name || "Portfolio";
  const siteRole = siteSettings.role || "";
  const description = siteSettings.siteMetadata.description || "Portfolio website.";
  const keywords = siteSettings.siteMetadata.keywords;
  const defaultTitle = siteRole ? `${siteName} | ${siteRole}` : siteName;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    openGraph: {
      title: defaultTitle,
      description,
      type: "website",
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
    },
  };
});

const getSitePageMetadataCached = cache(async (page: SitePageKey): Promise<Metadata> => {
  const siteSettings = await getSiteSettings();
  const intro = siteSettings.pageIntro[page];
  const navLabel = siteSettings.navigationItems.find((item) => item.href === intro.path)?.label;

  return createPageMetadata({
    title: navLabel || intro.eyebrow || intro.title || siteSettings.name || "Page",
    description: intro.description || siteSettings.siteMetadata.description || "Portfolio page.",
    path: intro.path,
    keywords: siteSettings.siteMetadata.keywords,
  });
});

export async function getSitePageMetadata(page: SitePageKey) {
  return getSitePageMetadataCached(page);
}

export const getHomePageMetadata = cache(async (): Promise<Metadata> => {
  const [siteSettings, landingPage] = await Promise.all([
    getSiteSettings(),
    getLandingPage(),
  ]);
  const homeLabel =
    siteSettings.navigationItems.find((item) => item.href === "/")?.label || "Home";
  const description =
    landingPage.heroSummary ||
    landingPage.heroSubtitle ||
    siteSettings.siteMetadata.description ||
    "Portfolio homepage.";

  return createPageMetadata({
    title: homeLabel,
    description,
    path: "/",
    keywords: siteSettings.siteMetadata.keywords,
  });
});
