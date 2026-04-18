import { Fragment, type ReactNode } from "react";
import Hero from "@/components/home/Hero";
import FeaturedAchievements from "@/components/home/FeaturedAchievements";
import FeaturedHighlights from "@/components/home/FeaturedHighlights";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import HomeContact from "@/components/home/HomeContact";
import HomeExplore from "@/components/home/HomeExplore";
import PageShell from "@/components/layout/PageShell";
import { getFeaturedData, getLandingPage, getSiteSettings } from "@/lib/data";
import { getHomePageMetadata } from "@/lib/metadata";
import type { LandingHomeSectionId } from "@/lib/site-content";

export async function generateMetadata() {
  return getHomePageMetadata();
}

export default async function Home() {
  const [siteSettings, landingPage] = await Promise.all([
    getSiteSettings(),
    getLandingPage(),
  ]);
  const [featuredProjects, featuredAchievements] = await Promise.all([
    getFeaturedData("project", landingPage.maxFeaturedProjects),
    landingPage.showAchievementsSection
      ? getFeaturedData("achievement", landingPage.maxFeaturedAchievements)
      : Promise.resolve([]),
  ]);

  const sections: Record<LandingHomeSectionId, ReactNode> = {
    highlights: <FeaturedHighlights cards={landingPage.highlightCards} />,
    projects: (
      <FeaturedProjects
        landingPage={landingPage}
        projects={featuredProjects}
      />
    ),
    achievements: (
      <FeaturedAchievements
        landingPage={landingPage}
        achievements={featuredAchievements}
      />
    ),
    explore: <HomeExplore landingPage={landingPage} />,
    contact: (
      <HomeContact
        landingPage={landingPage}
        siteSettings={siteSettings}
      />
    ),
  };

  return (
    <PageShell className="pt-8">
      <section className="mx-auto max-w-7xl space-y-18">
        <Hero siteSettings={siteSettings} landingPage={landingPage} />

        {landingPage.homeSections
          .filter((section) => section.enabled)
          .map((section) => {
            const content = sections[section.id];

            return content ? <Fragment key={section.id}>{content}</Fragment> : null;
          })}
      </section>
    </PageShell>
  );
}
