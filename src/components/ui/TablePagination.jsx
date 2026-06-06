import React from 'react';
import Button from './Button';

const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  resultsPerPage = 10,
  onPageChange,
  showResultsText = true,
  // optional appearance overrides
  wrapperClass = '',
  wrapperStyle = {},
  resultsTextClass = '',
  buttonClass = '',
}) => {
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const endResult = totalResults === 0 ? 0 : Math.min(currentPage * resultsPerPage, totalResults);

  const baseWrapper = 'bg-white border-gray-100 border-t px-4 py-4 rounded-b-lg flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3';
  const baseTextClass = 'text-base text-cardTitle text-center sm:text-left w-full sm:w-auto';
  const baseButtonClass = 'bg-white border border-cardTitle text-cardTitle rounded-xl px-4 py-0.5 text-base font-medium hover:bg-cardTitle/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={`${baseWrapper} ${wrapperClass}`} style={wrapperStyle}>
      {showResultsText && (
        <p className={`${baseTextClass} ${resultsTextClass}`}>
          Showing {startResult} to {endResult} of {totalResults} results
        </p>
      )}
      <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseButtonClass} ${buttonClass}`}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClass} ${buttonClass}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
