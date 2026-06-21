import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Input } from './ui/input';

export default function Pagination({ links, onPageChange }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [jumpPage, setJumpPage] = useState('');

  const totalPages = useMemo(() => {
    return links
      .map(link => parseInt(link.label, 10))
      .filter(n => !isNaN(n))
      .reduce((max, n) => Math.max(max, n), 1);
  }, [links]);

  const filteredLinks = useMemo(() => {
    const firstThree = links.slice(0, 3);
    const lastThree = links.slice(-3);
    const activeLink = links.find(link => link.active);
    
    if (totalPages > 6) {
      if (activeLink && parseInt(activeLink.label) > 3 && parseInt(activeLink.label) < totalPages - 2) {
        return [
          ...firstThree,
          { label: '...', url: null, active: false },
          activeLink,
          { label: '...', url: null, active: false },
          ...lastThree
        ];
      }
      else if (activeLink && parseInt(activeLink.label) <= 3) {
        return [
          ...firstThree,
          { label: '...', url: null, active: false },
          ...lastThree
        ];
      }
      else {
        return [
          ...firstThree,
          { label: '...', url: null, active: false },
          ...lastThree
        ];
      }
    }
    return links;
  }, [links, totalPages]);

  const handleClick = (link) => {
    if (!link.active && link.url) {
      const params = new URLSearchParams(link.url.split('?')[1]);
      onPageChange(parseInt(params.get('page') || 1));
    }
  };

  const handleJump = () => {
    const p = parseInt(jumpPage, 10);
    if (p >= 1 && p <= totalPages) {
      onPageChange(p);
      setJumpPage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleJump();
    }
  };

  return (
    <div className={cn(
      "flex items-center w-full gap-2",
      isArabic ? "flex-row-reverse" : "flex-row"
    )}>
      <nav 
        className={cn(
          "flex w-full",
          isArabic ? "justify-start" : "justify-end"
        )} 
        role="navigation" 
        aria-label="pagination"
      >
        <ul className={cn(
          "flex flex-row items-center gap-1",
          isArabic ? "flex-row-reverse" : "flex-row"
        )}>
          {filteredLinks.map((link, index) => (
            <li key={index}>
              <PaginationItem link={link} onClick={() => handleClick(link)} isArabic={isArabic} />
            </li>
          ))}
        </ul>
      </nav>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`1–${totalPages}`}
            className="h-9 w-20 rounded border px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label={t('Page number')}
          />
          <button
            onClick={handleJump}
            disabled={!jumpPage}
            className="h-9 px-3 rounded text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {t('Go')}
          </button>
        </div>
      )}
    </div>
  );
}

function PaginationItem({ link, onClick, isArabic }) {
  const { t } = useTranslation();

  if (link.label.includes('Previous')) {
    return (
      <PaginationLink onClick={onClick} disabled={!link.url}>
        {isArabic ? (
          <>
            <span className="mr-2">{t("Previous")}</span>
            <ChevronLeft className="h-4 w-4" />
          </>
        ) : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">{t("Previous")}</span>
          </>
        )}
      </PaginationLink>
    );
  }

  if (link.label.includes('Next')) {
    return (
      <PaginationLink onClick={onClick} disabled={!link.url}>
        {isArabic ? (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="ml-2">{t("Next")}</span>
          </>
        ) : (
          <>
            <span className="mr-2">{t("Next")}</span>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </PaginationLink>
    );
  }

  if (link.label.includes('...')) {
    return <PaginationEllipsis />;
  }

  return (
    <PaginationLink onClick={onClick} isActive={link.active}>
      {link.label}
    </PaginationLink>
  );
}

function PaginationLink({ children, isActive, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "h-9 px-3",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

function PaginationEllipsis() {
  const { t } = useTranslation();

  return (
    <span className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t('More pages')}</span>
    </span>
  );
}