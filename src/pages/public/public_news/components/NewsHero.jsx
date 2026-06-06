import React from 'react';
import { Link } from 'react-router-dom';

const NewsHero = ({ article }) => {
  return (
    <div className="w-full">
      <Link to={`/news/${article.id || 1}`} state={{ article }} className="block">
        <div className="w-full h-64 lg:h-120 rounded-md bg-gray-100 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-start lg:items-center">
          <div className="md:col-span-1">
            <p className="text-base text-secondary-text">{article.date}</p>
            <h3 className="font-semibold text-lg md:text-xl mt-2 text-[#0B544E] leading-tight">{article.title}</h3>
          </div>

          <div
            className="md:col-span-2 text-base text-color-secondary-text description max-w-xl"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.excerpt}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsHero;
