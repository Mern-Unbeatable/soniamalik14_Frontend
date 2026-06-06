import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';

const PageHeader = ({
    title,
    description,
    showSearch = false,
    searchPlaceholder = 'Search by name or location',
    onSearch,
    ctaText,
    ctaHref,
    onCtaClick,
    className = '',
}) => {
    const [q, setQ] = useState('');

    return (
        <div className={`w-full bg-transparent ${className}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="shrink min-w-0">
                    {title && <h1 className="text-3xl lg:text-[40px] font-semibold text-[#0B544E]">{title}</h1>}
                    {description && <p className="text-base md:text-lg text-[#585858] mt-1 md:mt-2.5">{description}</p>}
                </div>

                <div className="flex sm:items-center sm:flex-row flex-col gap-2 sm:gap-3 w-full md:w-auto">
                    {showSearch ? (
                        <div className="w-full md:w-auto">
                            {/* Desktop / md+: inline pale container with input + button */}
                            <div className="hidden md:flex items-center gap-3 bg-[#EAF6F4] rounded-lg p-3">
                                <div className="flex items-center bg-white rounded-md px-4 py-3 flex-1">
                                    <Search className="w-5 h-5 text-[#5EA39E] shrink-0" />
                                    <input
                                        type="search"
                                        value={q}
                                        onChange={(e) => {
                                            setQ(e.target.value);
                                            if (onSearch) onSearch(e.target.value);
                                        }}
                                        placeholder={searchPlaceholder}
                                        className="ml-3 w-full outline-none text-base text-gray-700 placeholder-[#747474]"
                                        aria-label="search"
                                    />
                                </div>

                                {ctaText && (
                                    ctaHref ? (
                                        <Link to={ctaHref} className="inline-flex items-center justify-center gap-1.5 bg-[#0F766E] hover:bg-[#0d655d] text-white px-4 py-3 rounded-md text-base font-medium whitespace-nowrap transition-colors">
                                            <Plus className="w-4 h-4 shrink-0" />
                                            {ctaText}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={onCtaClick}
                                            className="inline-flex items-center justify-center gap-1.5 bg-[#0F766E] hover:bg-[#0d655d] text-white px-4 py-3 rounded-md text-base font-medium whitespace-nowrap transition-colors"
                                        >
                                            <Plus className="w-4 h-4 shrink-0" />
                                            {ctaText}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Mobile: stacked search then CTA */}
                            <div className="flex flex-col md:hidden gap-3">
                                <div className="bg-white rounded-md px-4 py-3 w-full flex items-center">
                                    <Search className="w-5 h-5 text-[#5EA39E] shrink-0" />
                                    <input
                                        type="search"
                                        value={q}
                                        onChange={(e) => {
                                            setQ(e.target.value);
                                            if (onSearch) onSearch(e.target.value);
                                        }}
                                        placeholder={searchPlaceholder}
                                        className="ml-3 w-full outline-none text-base text-gray-700 placeholder-[#747474]"
                                        aria-label="mobile-search"
                                    />
                                </div>

                                {ctaText && (
                                    ctaHref ? (
                                        <Link to={ctaHref} className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0F766E] hover:bg-[#0d655d] text-white px-4 py-3 rounded-md text-base font-medium whitespace-nowrap transition-colors">
                                            <Plus className="w-4 h-4 shrink-0" />
                                            {ctaText}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={onCtaClick}
                                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0F766E] hover:bg-[#0d655d] text-white px-4 py-3 rounded-md text-base font-medium whitespace-nowrap transition-colors"
                                        >
                                            <Plus className="w-4 h-4 shrink-0" />
                                            {ctaText}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        // fallback: only CTA (no search)
                        ctaText && (
                            ctaHref ? (
                                <Link to={ctaHref} className="inline-flex items-center justify-center gap-1.5 bg-btn-primary hover:bg-[#0d655d] text-white px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-base font-medium whitespace-nowrap flex-1 md:flex-initial transition-colors">
                                    <Plus className="w-4 h-4 shrink-0" />
                                    {ctaText}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onCtaClick}
                                    className="inline-flex items-center justify-center gap-1.5 bg-btn-primary hover:bg-[#0d655d] text-white px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-base font-medium whitespace-nowrap flex-1 md:flex-initial transition-colors"
                                >
                                    <Plus className="w-4 h-4 shrink-0" />
                                    {ctaText}
                                </button>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
