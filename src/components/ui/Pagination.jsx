import React from 'react';

const ChevronLeft = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Pagination = ({ page = 1, total = 10, onChange = () => { } }) => {
  const buildPages = () => {
    const pages = [];
    // For mobile: show fewer pages (only current page neighbors)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (total <= 3) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    if (isMobile) {
      // Mobile: show compact view
      if (page === 1) {
        pages.push(1, 2);
        if (total > 2) pages.push('end-ellipsis');
        if (total > 2) pages.push(total);
      } else if (page === total) {
        pages.push(1);
        if (total > 2) pages.push('start-ellipsis');
        pages.push(total - 1, total);
      } else {
        pages.push(1);
        if (page > 2) pages.push('start-ellipsis');
        pages.push(page);
        if (page < total - 1) pages.push('end-ellipsis');
        if (total > 1) pages.push(total);
      }
    } else {
      // Desktop: show all pages when small
      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      // when there are many pages, show compact with ellipses
      if (page <= 3) {
        pages.push(1, 2, 3);
        pages.push('end-ellipsis');
        pages.push(total - 1, total);
        return pages;
      }

      if (page >= total - 2) {
        pages.push(1, 2);
        pages.push('start-ellipsis');
        for (let i = total - 2; i <= total; i++) pages.push(i);
        return pages;
      }

      // middle range
      pages.push(1);
      pages.push('start-ellipsis');
      pages.push(page - 1, page, page + 1);
      pages.push('end-ellipsis');
      pages.push(total);
    }
    return pages;
  };

  const pages = buildPages();

  const squareBase = 'h-9 sm:h-10 w-9 sm:w-10 inline-flex items-center justify-center rounded-md text-sm sm:text-base border transition-colors';

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 flex-wrap">
      <button
        aria-label="Prev"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${squareBase} ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) => {
        if (p === 'start-ellipsis' || p === 'end-ellipsis') {
          return (
            <div
              key={`e-${idx}`}
              className={`${squareBase} bg-white border-gray-200 text-gray-500 flex items-center justify-center`}
            >
              ...
            </div>
          );
        }

        const isCurrent = p === page;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${squareBase} ${isCurrent ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium' : 'border-gray-200 text-gray-800 hover:bg-gray-50'}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        aria-label="Next"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className={`${squareBase} ${page === total ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
