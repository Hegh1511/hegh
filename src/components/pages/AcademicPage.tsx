'use client';

import { motion } from 'framer-motion';
import {
  BeakerIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import PublicationsList from '@/components/publications/PublicationsList';
import CardPage from '@/components/pages/CardPage';
import SectionNav, { type SectionNavItem } from '@/components/pages/SectionNav';
import type { AcademicPageConfig, AcademicSectionData } from '@/types/page';

interface AcademicPageProps {
  config: AcademicPageConfig;
  sections: AcademicSectionData[];
  embedded?: boolean;
}

function getSectionIcon(section: AcademicSectionData) {
  const iconClassName = 'h-4 w-4 flex-shrink-0';

  if (section.kind === 'publication') {
    return <DocumentTextIcon className={iconClassName} />;
  }

  if (section.id.includes('project')) {
    return <BeakerIcon className={iconClassName} />;
  }

  return <UserGroupIcon className={iconClassName} />;
}

export default function AcademicPage({ config, sections, embedded = false }: AcademicPageProps) {
  const navItems: SectionNavItem[] = sections.map((section) => ({
    id: `academic-section-${section.id}`,
    label: section.label,
    icon: getSectionIcon(section),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: embedded ? 0 : 0.2 }}
    >
      <header className={embedded ? 'mb-5' : 'mb-8'}>
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} mb-4 font-serif font-bold text-primary`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} max-w-4xl leading-relaxed text-neutral-600 dark:text-neutral-500`}>
            {config.description}
          </p>
        )}
      </header>

      <div className={embedded ? '' : 'grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start'}>
        {!embedded && <SectionNav items={navItems} ariaLabel={config.title} />}

        <div className={`${embedded ? 'space-y-12' : 'space-y-16'} min-w-0`}>
          {sections.map((section) => (
            <motion.section
              key={section.id}
              id={`academic-section-${section.id}`}
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.25 }}
            >
              {section.kind === 'publication' ? (
                <PublicationsList
                  config={section.config}
                  publications={section.publications}
                  embedded
                />
              ) : (
                <CardPage config={section.config} embedded />
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
