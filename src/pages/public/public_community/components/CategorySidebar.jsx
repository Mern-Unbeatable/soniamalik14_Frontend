import React from 'react';

const CategorySidebar = ({ activeCategory = 'All posts', onCategoryChange }) => {
  const categoryGroups = [
  {
      title: 'Browse',
      items: [
        'All posts',
        'Stories & Experiences',
        'Questions & Advice'
      ]
    },
    {
      title: 'Get involved',
      items: [
        'Match & event support'
      ]
    }
  ];

  return (
    <div>
      {/* Mobile: show as select */}
      <div className="block lg:hidden mb-4">
        <label className="sr-only">Categories</label>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white py-2 lg:py-3 px-4 appearance-none focus:ring-2 focus:ring-btn-primary outline-none"
          >
            {categoryGroups.flatMap(group => group.items).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
        </div>
      </div>

      {/* Desktop: sidebar list */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-md p-4">
        {categoryGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? 'mt-6' : ''}>
            <h3 className="font-semibold text-base mb-4 text-heading">{group.title}</h3>
            <ul className="space-y-2">
              {group.items.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <li key={category}>
                    <button
                      onClick={() => onCategoryChange && onCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-md text-base transition-all ${isActive
                          ? 'bg-secondary text-btn-primary border-l-4 border-btn-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                    >
                      {category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
