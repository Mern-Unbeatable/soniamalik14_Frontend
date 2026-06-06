import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'p-4 md:p-6',
  hover = false,
  ...props 
}) => {
  const baseStyles = 'rounded-xl bg-white border';
  
  const variants = {
    default: 'border-gray-100 shadow-sm',
    elevated: 'border-gray-200 shadow-lg',
    outlined: 'border-gray-300',
    ghost: 'border-transparent shadow-none'
  };

  const hoverStyles = hover 
      ? 'hover:shadow-xl  transition-all duration-300' 
    : '';

  return (
    <div 
      className={clsx(
        baseStyles,
        variants[variant],
        padding,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;