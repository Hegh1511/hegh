import type { Publication } from './publication';

export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'academic';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    image_alt?: string;
    imageAlt?: string;
}

export interface CardGroup {
    title: string;
    description?: string;
    items: CardItem[];
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    layout?: 'default' | 'award';
    empty_message?: string;
    emptyMessage?: string;
    items?: CardItem[];
    groups?: CardGroup[];
}

export interface AcademicSectionConfig {
    id: string;
    label: string;
    kind: 'publication' | 'card';
    source: string;
    title?: string;
    description?: string;
}

export interface AcademicPageConfig extends BasePageConfig {
    type: 'academic';
    sections: AcademicSectionConfig[];
}

export interface AcademicPublicationSectionData {
    id: string;
    label: string;
    kind: 'publication';
    config: PublicationPageConfig;
    publications: Publication[];
}

export interface AcademicCardSectionData {
    id: string;
    label: string;
    kind: 'card';
    config: CardPageConfig;
}

export type AcademicSectionData = AcademicPublicationSectionData | AcademicCardSectionData;
