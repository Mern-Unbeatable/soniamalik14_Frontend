import React from 'react';
import { Link } from 'react-router-dom';

const NewsItem = ({ item }) => {
  return (
    <Link to={`/news/${item.id || 1}`} state={{ article: item }} className="block">
      <div className="py-5">
        <p className="text-base text-secondary-text">{item.date}</p>
        <h4 className="font-semibold text-base mt-1 text-[#0B544E] leading-tight">{item.title}</h4>
        {item.excerpt && (
          <p
            className="text-base mt-2 text-color-secondary-text description"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.excerpt}
          </p>
        )}
        <div className="border-t border-gray-200 mt-4" />
      </div>
    </Link>
  );
};

export default NewsItem;
