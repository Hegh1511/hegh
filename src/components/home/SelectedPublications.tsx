'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import { withBasePath } from '@/lib/assetPath';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;
    const firstAuthorPublications = publications.filter((pub) => pub.authors[0]?.isHighlighted);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} -&gt;
                </Link>
            </div>
            <div className="space-y-4">
                {firstAuthorPublications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-md transition-all duration-200"
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-500">
                            <span>{pub.journal || pub.conference}</span>
                            <span>{pub.year}</span>
                            {pub.casQuartile && <span>{pub.casQuartile}</span>}
                            {pub.casTop && <span>{messages.publications.casTop}</span>}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {pub.pdfUrl && (
                                <a
                                    href={withBasePath(pub.pdfUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-accent hover:text-white dark:bg-neutral-900 dark:text-neutral-300"
                                >
                                    <ArrowDownTrayIcon className="mr-1.5 h-3 w-3" />
                                    PDF
                                </a>
                            )}
                            {pub.doi && (
                                <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-accent hover:text-white dark:bg-neutral-900 dark:text-neutral-300"
                                >
                                    DOI
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
