'use client';

import { useEffect, useState, type ReactNode } from 'react';

export interface SectionNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface SectionNavProps {
  items: SectionNavItem[];
  ariaLabel: string;
}

export default function SectionNav({ items, ariaLabel }: SectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');

  useEffect(() => {
    if (!items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id || '');
    }
  }, [activeId, items]);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      const sectionElements = items
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (sectionElements.length === 0) {
        return;
      }

      let currentId = sectionElements[0].id;
      for (const element of sectionElements) {
        if (element.getBoundingClientRect().top <= 144) {
          currentId = element.id;
        } else {
          break;
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        currentId = sectionElements[sectionElements.length - 1].id;
      }

      setActiveId(currentId);
    };

    const handleScroll = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [items]);

  return (
    <nav
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto border-b border-neutral-200 pb-2 dark:border-neutral-800 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? 'location' : undefined}
            onClick={() => setActiveId(item.id)}
            className={`flex min-h-10 flex-shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition-colors lg:w-full lg:border-b-0 lg:border-l-2 ${
              isActive
                ? 'border-accent bg-neutral-100 text-accent dark:bg-neutral-800'
                : 'border-transparent text-neutral-500 hover:bg-neutral-100 hover:text-primary dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
