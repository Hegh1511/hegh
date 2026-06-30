import { getBibtexContent, getTomlContent } from './content';
import { parseBibTeX } from './bibtexParser';
import type {
  AcademicPageConfig,
  AcademicSectionData,
  CardPageConfig,
  PublicationPageConfig,
} from '@/types/page';

export function loadAcademicSections(
  config: AcademicPageConfig,
  locale?: string,
): AcademicSectionData[] {
  return config.sections.map((section) => {
    if (section.kind === 'publication') {
      const publicationConfig: PublicationPageConfig = {
        type: 'publication',
        title: section.title || section.label,
        description: section.description,
        source: section.source,
      };

      return {
        id: section.id,
        label: section.label,
        kind: 'publication',
        config: publicationConfig,
        publications: parseBibTeX(getBibtexContent(section.source, locale), locale),
      };
    }

    const sourceConfig = getTomlContent<CardPageConfig>(section.source, locale);
    const cardConfig: CardPageConfig = {
      type: 'card',
      title: section.title || sourceConfig?.title || section.label,
      description: section.description ?? sourceConfig?.description,
      layout: sourceConfig?.layout,
      empty_message: sourceConfig?.empty_message,
      emptyMessage: sourceConfig?.emptyMessage,
      items: sourceConfig?.items || [],
      groups: sourceConfig?.groups,
    };

    return {
      id: section.id,
      label: section.label,
      kind: 'card',
      config: cardConfig,
    };
  });
}
