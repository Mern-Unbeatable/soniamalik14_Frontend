import React from 'react';
import { FiChevronRight, FiMessageSquare } from 'react-icons/fi';

const NotificationItem = ({ text, isRead, onClick }) => (
  <div 
    className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
      isRead ? 'bg-white' : 'bg-[#147A73]/5'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="bg-gray-50 p-2 rounded-md border border-gray-100 relative">
        <FiMessageSquare className={isRead ? 'text-gray-400' : 'text-[#147A73]'} />
        {!isRead && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#147A73] animate-pulse" />
        )}
      </div>
      <span className={`text-sm text-gray-700 ${isRead ? 'font-normal' : 'font-semibold text-gray-900'}`}>
        {text}
      </span>
    </div>
    <FiChevronRight className="text-gray-400" />
  </div>
);

export default NotificationItem;
