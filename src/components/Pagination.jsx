import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

export default function Pagination({ links, onPageChange }) {
  const { t } = useTranslation()
  const handleClick = (link) => {
    if (!link.active && link.url) {
      const urlParams = new URLSearchParams(link.url.split('?')[1]);
      const pageNumber = parseInt(urlParams.get('page') || '1');
      onPageChange(pageNumber);
    }
  };

  return (
    <nav className="mx-auto flex w-full justify-end" role="navigation" aria-label="pagination">
      <ul className="flex flex-row items-center gap-1">
        {links.map((link, index) => (
          <li key={index}>
            <PaginationItem link={link} onClick={() => handleClick(link)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PaginationItem({ link, onClick }) {
  const { t } = useTranslation()
  if (link.label.includes('Previous')) {
    return (
      <PaginationLink onClick={onClick} disabled={!link.url}>
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-2">{t("Previous")}</span> {/* Display Previous label */}
      </PaginationLink>
    );
  }

  if (link.label.includes('Next')) {
    return (
      <PaginationLink onClick={onClick} disabled={!link.url}>
        <span className="mr-2">{t("Next")}</span> {/* Display Next label */}
        <ChevronRight className="h-4 w-4" />
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
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-3", // Adjusted width for text
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
  return (
    <span className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
