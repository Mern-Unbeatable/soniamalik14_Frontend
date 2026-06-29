import React, { useCallback, useEffect, useState } from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { GET, PATCH, DELETE } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ProviderNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);

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
      title: item?.title || 'Notification',
      message: item?.message || '-',
      time: formatDateTime(item?.createdAt),
      name: fallbackName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=E7F1F1&color=1D1D1D`,
      read: Boolean(item?.isRead),
    };
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GET(ENDPOINT.NOTIFICATIONS.LIST, { page: 1, limit: 20 });
      const list = response?.data?.data?.notifications || [];
      setNotifications((Array.isArray(list) ? list : []).map(mapNotification));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (markAllLoading) return;
    try {
      setMarkAllLoading(true);
      await PATCH(ENDPOINT.NOTIFICATIONS.READ_ALL, {});
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
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
        prev.map((item) => (item.id === notificationId ? { ...item, read: true } : item))
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
      setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="dashboardPy">
      <section className=" ">
        <div className="flex items-center justify-between  px-5 py-4">
          <h1 className="text-xl font-semibold text-[#1D1D1D]">Notifications</h1>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markAllLoading}
            className="inline-flex items-center gap-2 text-base font-medium text-[#1D1D1D] hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>Mark All Read</span>
            <CheckCheck className="h-5 w-5" />
          </button>
        </div>

        <div className=" divide-y divide-[#767676] rounded-lg overflow-hidden">
          {loading && <div className="px-5 py-8 text-center text-sm text-gray-600">Loading notifications...</div>}
          {!loading && notifications.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-500">No notifications found.</div>
          )}
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`group relative flex gap-3 px-4 py-4 md:gap-4 md:px-5 md:py-6.5 ${notification.read ? 'bg-[#E8E8E8]' : 'bg-[#E8E8E8]'}`}
            >
              <img
                src={notification.avatar}
                alt={notification.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-[#2F3B3A] md:text-base">
                  <span className="font-semibold text-[#1D1D1D]">{notification.title}</span>{' '}
                  <span>{notification.message}</span>
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm text-[#6B7280]">{notification.time}</p>
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkSingleRead(notification.id)}
                      disabled={markingId === notification.id}
                      className="text-xs font-medium text-[#0F766E] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteNotification(notification.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete notification"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderNotifications;
