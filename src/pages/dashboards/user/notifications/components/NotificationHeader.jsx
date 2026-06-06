import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';

const NotificationHeader = ({
  onMarkAllRead,
  onDeleteAll,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 pb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
        <button
          onClick={onMarkAllRead}
          className="px-3 md:px-4 py-2 text-sm md:text-base bg-loginInput/10 text-btn-primary rounded-lg font-medium hover:bg-blue-100 transition flex items-center gap-2 shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span className="hidden md:inline">Mark all as read</span>
          <span className="md:hidden">Mark read</span>
        </button>

        <button
          onClick={onDeleteAll}
          disabled={totalCount === 0}
          className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-lg font-medium transition flex items-center gap-2 shrink-0 ${
            totalCount > 0
              ? 'bg-red-50 text-red-700 hover:bg-red-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:inline">Delete all ({totalCount})</span>
          <span className="md:hidden">Del</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;
