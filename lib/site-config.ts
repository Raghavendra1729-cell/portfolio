import { defaultProfileImage, navigationItems, pageMetadata, siteMetadata } from "@/content/structure";
import { defaultSiteSettings } from "@/lib/site-content";

export const siteConfig = {
  name: siteMetadata.name || defaultSiteSettings.name,
  role: siteMetadata.role || defaultSiteSettings.role,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  defaultProfileImage,
};

export const publicNavItems = navigationItems
  .filter((item) => item.enabled)
  .map(({ label, href }) => ({ label, href }));

export { pageMetadata };
