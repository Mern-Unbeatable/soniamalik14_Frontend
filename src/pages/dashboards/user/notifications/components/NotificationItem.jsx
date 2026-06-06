import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { formatDate } from '../../../../../utils/Helper';

const NotificationItem = ({
  id,
  title,
  message,
  text,
  createdAt,
  isRead,
  onClick,
  onMarkRead,
  onDelete,
}) => {
  const displayTitle = title || 'Notification';
  const displayBody = message || text || '';
  const displayDate = createdAt ? formatDate(createdAt) : '';

  return (
    <div
      className={`flex items-start gap-3 p-4 md:p-5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        isRead ? 'bg-white' : 'bg-blue-50/30'
      }`}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm md:text-base ${isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
            {displayTitle}
          </span>
          {!isRead && (
            <span className="w-2 h-2 rounded-full bg-[#147A73] inline-block animate-pulse" title="Unread"></span>
          )}
        </div>
        <p className={`text-xs md:text-sm text-gray-600 leading-relaxed ${isRead ? 'font-normal' : 'font-medium text-gray-800'}`}>
          {displayBody}
        </p>
        {displayDate && (
          <span className="text-[10px] md:text-xs text-gray-400 mt-2 block font-normal">
            {displayDate}
          </span>
        )}

        <div className="mt-2 flex items-center gap-3">
          {!isRead && (
            <button
              type="button"
              className="text-xs font-medium text-[#147A73] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead?.();
              }}
            >
              Mark as read
            </button>
          )}

          <button
            type="button"
            className="text-xs font-medium text-red-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <FiChevronRight className="text-gray-400 shrink-0 w-4 h-4 md:w-5 md:h-5 mt-1.5 align-middle" />
    </div>
  );
};

export default NotificationItem;
