import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import SavedCard from './components/SavedCard';
import Pagination from '../../../../components/ui/Pagination';

const Saved = () => {
  const initialSavedItems = [
    { 
      id: 1, 
      title: 'Sunday Football', 
      location: 'Richmond', 
      time: '6:00pm',
      imageSrc: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
      category: 'Event'
    },
    { 
      id: 2, 
      title: 'Basketball Championship', 
      location: 'Brooklyn Court', 
      time: '4:30pm',
      imageSrc: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
      category: 'Event'
    },
    { 
      id: 3, 
      title: 'Morning Tennis Club', 
      location: 'Central Park', 
      time: '8:00am',
      imageSrc: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800&auto=format&fit=crop',
      category: 'Sport'
    },
    { 
      id: 4, 
      title: 'Swimming Gala', 
      location: 'Aquatic Center', 
      time: '10:00am',
      imageSrc: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop',
      category: 'Event'
    },
    { 
      id: 5, 
      title: 'Cricket Friendly', 
      location: 'Oval Ground', 
      time: '11:00am',
      imageSrc: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
      category: 'Sport'
    },
    { 
      id: 6, 
      title: 'Evening Yoga', 
      location: 'Wellness Studio', 
      time: '7:00pm',
      imageSrc: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      category: 'Course'
    },
    { 
      id: 7, 
      title: 'Badminton Doubles', 
      location: 'Indoor Arena', 
      time: '5:00pm',
      imageSrc: 'https://images.unsplash.com/photo-1626225453014-4f58198f7143?q=80&w=800&auto=format&fit=crop',
      category: 'Event'
    },
    { 
      id: 8, 
      title: 'Mountain Biking', 
      location: 'Green Valley', 
      time: '9:00am',
      imageSrc: 'https://images.unsplash.com/photo-1544191952-e56847844059?q=80&w=800&auto=format&fit=crop',
      category: 'Sport'
    },
  ];

  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(savedItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = savedItems.slice(startIdx, endIdx);

  const handleViewDetails = (itemId) => {
    console.log('View details for item:', itemId);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = savedItems.filter(item => item.id !== itemId);
    setSavedItems(updatedItems);
    
    // Reset to page 1 if current page is now empty
    if (currentPage > Math.ceil(updatedItems.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Event</h1>
      </div>

      {savedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {currentItems.map((item) => (
              <SavedCard
                key={item.id}
                title={item.title}
                location={item.location}
                time={item.time}
                imageSrc={item.imageSrc}
                onViewDetails={() => handleViewDetails(item.id)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No saved items found</p>
        </div>
      )}
    </div>
  );
};

export default Saved;
