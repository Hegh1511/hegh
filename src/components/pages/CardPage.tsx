'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChevronRightIcon, MagnifyingGlassPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SectionNav, { type SectionNavItem } from '@/components/pages/SectionNav';
import { withBasePath } from '@/lib/assetPath';
import { CardItem, CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

interface SelectedImage {
    src: string;
    alt: string;
    title: string;
}

function normalizeImageSrc(src: string): string {
    const trimmed = src.trim();

    if (!trimmed) {
        return '';
    }

    if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('data:')) {
        return trimmed;
    }

    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^public\//, '')}`;
    return withBasePath(normalized);
}

function isExternalImage(src: string): boolean {
    return /^(https?:)?\/\//.test(src) || src.startsWith('data:');
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
    const isAwardLayout = config.layout === 'award';

    const sections = useMemo(() => {
        if (config.groups?.length) {
            return config.groups.map((group, index) => ({
                id: `card-section-${index}`,
                key: group.title,
                title: group.title,
                description: group.description,
                items: group.items || [],
            }));
        }

        return [{
            id: 'card-section-default',
            key: 'default',
            title: '',
            description: undefined,
            items: config.items || [],
        }];
    }, [config.groups, config.items]);

    const awardNavItems: SectionNavItem[] = sections.map((section) => ({
        id: section.id,
        label: section.title,
        icon: <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />,
    }));

    useEffect(() => {
        if (!selectedImage) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedImage(null);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    const renderAwardCard = (item: CardItem, index: number) => {
        const imageSrc = item.image ? normalizeImageSrc(item.image) : '';
        const imageAlt = item.image_alt || item.imageAlt || item.title;

        return (
            <motion.div
                key={`${item.title}-${item.date || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className={`bg-white dark:bg-neutral-900 ${embedded ? "p-3" : "px-4 py-3"} rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200 sm:hover:scale-[1.005]`}
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    {item.date && (
                        <div className="w-32 sm:w-40 md:w-44 flex-shrink-0 whitespace-nowrap text-sm font-semibold leading-tight text-neutral-500 dark:text-neutral-400">
                            {item.date}
                        </div>
                    )}

                    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
                        <h3 className={`${embedded ? "text-base" : "text-lg"} font-semibold text-primary leading-snug`}>
                            {item.title}
                        </h3>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-xs" : "text-sm"} text-accent font-medium leading-snug sm:col-start-1`}>
                                {item.subtitle}
                            </p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-xs" : "text-sm"} text-neutral-600 dark:text-neutral-500 leading-relaxed sm:col-span-2`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {imageSrc && (
                        <button
                            type="button"
                            onClick={() => setSelectedImage({ src: imageSrc, alt: imageAlt, title: item.title })}
                            className="group relative h-14 w-20 sm:h-16 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 text-left shadow-sm transition-all duration-200 hover:border-accent hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800"
                            aria-label={`Open image for ${item.title}`}
                        >
                            {isExternalImage(imageSrc) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                            ) : (
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    sizes="96px"
                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                                <MagnifyingGlassPlusIcon className="h-5 w-5 drop-shadow" />
                            </span>
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderCard = (item: CardItem, index: number) => {
        const imageSrc = item.image ? normalizeImageSrc(item.image) : '';
        const imageAlt = item.image_alt || item.imageAlt || item.title;

        return (
            <motion.div
                key={`${item.title}-${item.date || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 sm:hover:scale-[1.01]`}
            >
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary leading-snug`}>{item.title}</h3>
                            {item.date && (
                                <span className="w-fit text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {imageSrc && (
                        <button
                            type="button"
                            onClick={() => setSelectedImage({ src: imageSrc, alt: imageAlt, title: item.title })}
                            className="group relative w-full md:w-44 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 text-left shadow-sm transition-all duration-200 hover:border-accent hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800"
                            aria-label={`Open image for ${item.title}`}
                        >
                            <span className="relative block aspect-[4/3]">
                                {isExternalImage(imageSrc) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imageSrc}
                                        alt={imageAlt}
                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                ) : (
                                    <Image
                                        src={imageSrc}
                                        alt={imageAlt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 176px"
                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                )}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                                <MagnifyingGlassPlusIcon className="h-7 w-7 drop-shadow" />
                            </span>
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-4xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={isAwardLayout && !embedded && sections.length > 1 ? "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start" : ""}>
                {isAwardLayout && !embedded && sections.length > 1 && (
                    <SectionNav items={awardNavItems} ariaLabel={config.title} />
                )}

                <div className={`${embedded ? "space-y-8" : "space-y-12"} min-w-0`}>
                    {sections.map((section) => (
                        <section key={section.key} id={section.id} className="scroll-mt-28 space-y-4">
                            {section.title && (
                                <div>
                                    <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-bold text-primary border-b border-neutral-200 pb-2 dark:border-neutral-800`}>
                                        {section.title}
                                    </h2>
                                    {section.description && (
                                        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed">
                                            <ReactMarkdown components={markdownComponents}>
                                                {section.description}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className={`grid grid-cols-[minmax(0,1fr)] ${embedded ? "gap-3" : isAwardLayout ? "gap-3" : "gap-6"}`}>
                                {section.items.length > 0 ? (
                                    section.items.map((item, index) => (
                                        isAwardLayout ? renderAwardCard(item, index) : renderCard(item, index)
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                                        {config.empty_message || config.emptyMessage || 'No entries yet.'}
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedImage.title}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 12 }}
                            transition={{ duration: 0.18 }}
                            className="relative w-full max-w-5xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                aria-label="Close image preview"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                            <div className="overflow-hidden rounded-lg bg-black shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className="mx-auto max-h-[85vh] max-w-full object-contain"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
