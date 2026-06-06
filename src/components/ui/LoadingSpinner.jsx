import React from 'react';

const LoadingSpinner = ({
  label = 'Loading...',
  containerClassName = '',
  spinnerClassName = '',
  labelClassName = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-6 ${containerClassName}`.trim()}>
      <div
        className={`h-10 w-10 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-btn-primary ${spinnerClassName}`.trim()}
        aria-hidden="true"
      />
      {label ? <p className={`text-sm text-gray-500 text-center ${labelClassName}`.trim()}>{label}</p> : null}
    </div>
  );
};

export default LoadingSpinner;
