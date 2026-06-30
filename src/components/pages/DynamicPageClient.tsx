'use client';

import PublicationsList from '@/components/publications/PublicationsList';
import Profile from '@/components/home/Profile';
import type { SiteConfig } from '@/lib/config';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import AcademicPage from '@/components/pages/AcademicPage';
import { Publication } from '@/types/publication';
import {
  AcademicPageConfig,
  AcademicSectionData,
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
} from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export type DynamicPageLocaleData =
  | { type: 'publication'; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; config: TextPageConfig; content: string }
  | { type: 'card'; config: CardPageConfig }
  | { type: 'academic'; config: AcademicPageConfig; sections: AcademicSectionData[] };

interface DynamicPageClientProps {
  dataByLocale: Record<string, DynamicPageLocaleData>;
  defaultLocale: string;
  sidebarByLocale?: Record<string, {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
  }>;
}

export default function DynamicPageClient({ dataByLocale, defaultLocale, sidebarByLocale }: DynamicPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const pageData = dataByLocale[locale] || fallback;

  if (!pageData) {
    return null;
  }

  const usesSectionSidebar =
    pageData.type === 'academic' ||
    (pageData.type === 'card' && pageData.config.layout === 'award');

  const sidebarProfile = sidebarByLocale?.[locale] || sidebarByLocale?.[defaultLocale];
  const showProfileSidebar = pageData.type === 'text' && sidebarProfile;

  if (showProfileSidebar) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Profile
              author={sidebarProfile.author}
              social={sidebarProfile.social}
              features={sidebarProfile.features}
              researchInterests={sidebarProfile.researchInterests}
            />
          </div>
          <div className="lg:col-span-3">
            <TextPage config={pageData.config} content={pageData.content} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${usesSectionSidebar ? 'max-w-6xl' : 'max-w-6xl'} mx-auto px-4 py-12 sm:px-6 lg:px-8`}>
      {pageData.type === 'publication' && (
        <PublicationsList config={pageData.config} publications={pageData.publications} />
      )}
      {pageData.type === 'text' && (
        <TextPage config={pageData.config} content={pageData.content} />
      )}
      {pageData.type === 'card' && (
        <CardPage config={pageData.config} />
      )}
      {pageData.type === 'academic' && (
        <AcademicPage config={pageData.config} sections={pageData.sections} />
      )}
    </div>
  );
}