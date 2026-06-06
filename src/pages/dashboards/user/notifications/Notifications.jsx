import React, { useState, useEffect } from 'react';
import NotificationHeader from './components/NotificationHeader';
import NotificationItem from './components/NotificationItem';
import { GET, PATCH, DELETE } from '../../../../services/httpMethods';
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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from real backend API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await GET('/api/notifications');
      const data = res?.data?.data?.notifications || res?.data?.notifications || res?.notifications || [];
      setNotifications((Array.isArray(data) ? data : []).map(normalizeNotification));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      
      // Primary backend route for mark all as read.
      await PATCH('/api/notifications/read-all');
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Try fallback endpoints.
      try {
        await PATCH('/api/notifications/read');
        toast.success('All notifications marked as read');
      } catch (err) {
        console.error('Failed to mark all as read with fallback /read:', err);
        try {
          await PATCH('/api/notifications/mark-all-read');
          toast.success('All notifications marked as read');
        } catch (fallbackErr) {
          console.error('Failed to mark all as read with fallback /mark-all-read:', fallbackErr);
          toast.error('Failed to mark all notifications as read');
        }
      }
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!id) return;

    const previousNotifications = notifications;

    // Optimistic UI update
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));

    try {
      await DELETE(`/api/notifications/${encodeURIComponent(id)}`);
      toast.success('Notification deleted');
    } catch (error) {
      console.error(`Failed to delete notification ${id}:`, error);
      // Rollback on failure
      setNotifications(previousNotifications);
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;

    const previousNotifications = notifications;

    // Optimistic UI update
    setNotifications([]);

    try {
      await PATCH('/api/notifications/read-all');
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      // Rollback on failure
      setNotifications(previousNotifications);
      toast.error('Failed to delete all notifications');
    }
  };

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

  return (
    <div className="p-4 md:p-6">
      <NotificationHeader
        onMarkAllRead={handleMarkAllRead}
        onDeleteAll={handleDeleteAll}
        totalCount={notifications.length}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#147A73] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              id={notif.id}
              title={notif.title}
              message={notif.message}
              createdAt={notif.createdAt}
              isRead={notif.isRead}
              onClick={() => handleNotificationClick(notif.id)}
              onMarkRead={() => handleNotificationClick(notif.id)}
              onDelete={() => handleDeleteSingle(notif.id)}
            />
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
