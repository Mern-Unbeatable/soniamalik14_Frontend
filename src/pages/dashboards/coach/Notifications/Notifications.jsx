import React, { useCallback, useEffect, useState } from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { GET, PATCH, DELETE } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const Notifications = () => {
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
        <div className=" min-h-screen py-10 px-4 sm:px-8 font-sans flex justify-center">
            <div className="w-full ">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Notifications</h1>
                    <button
                        onClick={handleMarkAllRead}
                        disabled={markAllLoading}
                        className="flex items-center gap-2 text-[15px] font-medium text-[#2C2C2C] hover:text-black transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Mark All Read
                        <CheckCheck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-[#EBEBEB] rounded-lg overflow-hidden shadow-sm">
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
                            }  transition-colors cursor-pointer`}
                        >
                            {/* Avatar */}
                            <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                                <img
                                    src={notif.avatar}
                                    alt={notif.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                {notif.id === 1 ? (
                                    <p className="text-[15px] text-[#2C2C2C] leading-snug">
                                        <span className="font-semibold text-black">{notif.name}</span> {notif.message}
                                    </p>
                                ) : (
                                    <p className="text-[15px] text-[#2C2C2C] leading-snug pr-4">
                                        {notif.message}
                                    </p>
                                )}
                                <p className="text-[13px] text-[#888888] mt-1.5">
                                    {notif.time}
                                </p>
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Delete notification"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Notifications;