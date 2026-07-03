import React, { useCallback, useEffect, useState } from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { GET, PATCH, DELETE } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/ui/Pagination';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatDateTime = (value) => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleString();
  };

  const mapNotification = (item) => {
    const senderName = item?.data?.userName || item?.data?.senderName || '';
    const fallbackName = senderName || item?.title || 'Notification';
    return {
      id: item?.id,
      name: fallbackName,
      message: item?.message || '-',
      time: formatDateTime(item?.createdAt),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=EBEBEB&color=1A1A1A`,
      read: Boolean(item?.isRead),
    };
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GET(ENDPOINT.NOTIFICATIONS.LIST, { page: currentPage, limit: 6 });
      const list = response?.data?.data?.notifications || [];
      const pagination = response?.data?.data?.pagination || {};
      setNotifications((Array.isArray(list) ? list : []).map(mapNotification));
      setTotalPages(Number(pagination?.totalPages) > 0 ? Number(pagination.totalPages) : 1);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setTotalPages(1);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (markAllLoading) return;
    try {
      setMarkAllLoading(true);
      await PATCH(ENDPOINT.NOTIFICATIONS.READ_ALL, {});
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all as read');
    } finally {
      setMarkAllLoading(false);
    }
  };

  const handleMarkSingleRead = async (notificationId) => {
    if (!notificationId || markingId) return;
    try {
      setMarkingId(notificationId);
      await PATCH(ENDPOINT.NOTIFICATIONS.READ(notificationId), {});
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark as read');
    } finally {
      setMarkingId(null);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!notificationId) return;
    try {
      await DELETE(`/api/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="flex min-h-screen justify-center px-4 py-10 font-sans sm:px-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1A1A1A] sm:text-2xl">Notifications</h1>
          <button
            onClick={handleMarkAllRead}
            disabled={markAllLoading}
            className="flex items-center gap-2 text-[15px] font-medium text-[#2C2C2C] transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Mark All Read
            <CheckCheck className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-hidden rounded-lg bg-[#EBEBEB] shadow-sm">
          {loading && (
            <div className="p-6 text-center text-sm text-gray-600">Loading notifications...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">No notifications found.</div>
          )}
          {notifications.map((notif, index) => (
            <div
              key={notif.id}
              className={`group relative flex gap-4 p-5 sm:p-6 ${
                index !== notifications.length - 1 ? 'border-b border-[#767676]' : ''
              } cursor-pointer transition-colors`}
            >
              {/* Avatar */}
              <div className="h-[42px] w-[42px] flex-shrink-0 overflow-hidden rounded-full bg-gray-300 sm:h-[46px] sm:w-[46px]">
                <img src={notif.avatar} alt={notif.name} className="h-full w-full object-cover" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                {notif.id === 1 ? (
                  <p className="text-[15px] leading-snug text-[#2C2C2C]">
                    <span className="font-semibold text-black">{notif.name}</span> {notif.message}
                  </p>
                ) : (
                  <p className="pr-4 text-[15px] leading-snug text-[#2C2C2C]">{notif.message}</p>
                )}
                <p className="mt-1.5 text-[13px] text-[#888888]">{notif.time}</p>
                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkSingleRead(notif.id)}
                    disabled={markingId === notif.id}
                    className="mt-2 text-xs font-medium text-[#0F766E] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mark Read
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notif.id);
                }}
                className="absolute top-1/2 right-4 hidden -translate-y-1/2 p-1 text-gray-400 transition-colors group-hover:block hover:text-red-500"
                title="Delete notification"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && notifications.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
