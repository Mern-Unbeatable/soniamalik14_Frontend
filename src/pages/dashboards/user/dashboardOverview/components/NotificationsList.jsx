import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { GET, PATCH } from '../../../../../services/httpMethods';
import { toast } from 'react-toastify';

const getNotificationId = (notification, index) =>
  notification?.id ?? notification?._id ?? notification?.notificationId ?? notification?.uuid ?? `notification-${index}`;

const isNotificationRead = (notification) => {
  if (typeof notification?.isRead === 'boolean') return notification.isRead;
  if (typeof notification?.read === 'boolean') return notification.read;
  return false;
};

const normalizeNotification = (notification, index) => ({
  ...notification,
  id: getNotificationId(notification, index),
  isRead: isNotificationRead(notification),
});

const extractNotifications = (res) => {
  const payload = res?.data;

  if (Array.isArray(payload?.data?.notifications)) return payload.data.notifications;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(res?.notifications)) return res.notifications;

  return [];
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await GET('/api/notifications');
      const data = extractNotifications(res);
      setNotifications((Array.isArray(data) ? data : []).map(normalizeNotification));
    } catch (error) {
      console.error('Failed to fetch notifications on dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (id) => {
    if (!id) return;

    const clickedNotif = notifications.find((notif) => notif.id === id);
    if (clickedNotif && clickedNotif.isRead) {
      return;
    }

    try {
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );

      // Backend route uses PATCH for marking a single notification as read.
      await PATCH(`/api/notifications/${encodeURIComponent(id)}/read`);
      toast.success('Notification marked as read');
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      // Fallback
      try {
        await PATCH(`/api/notifications/${encodeURIComponent(id)}`, { isRead: true });
        toast.success('Notification marked as read');
      } catch (err) {
        console.error(`Failed fallback mark read:`, err);
        toast.error('Failed to mark notification as read');
      }
    }
  };

  // Limit to top 5 notifications
  const displayedNotifications = notifications.slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111827] mb-6">Notifications</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#147A73] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-400 text-sm font-medium">Loading notifications...</p>
          </div>
        ) : displayedNotifications.length > 0 ? (
          displayedNotifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              text={notif.message || notif.title}
              isRead={notif.isRead}
              onClick={() => handleNotificationClick(notif.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">Notifications not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
