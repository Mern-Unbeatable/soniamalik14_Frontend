import React, { useState } from 'react';
import { CheckCheck } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            name: 'Brian Griffin',
            message: 'wants to collaborate',
            time: '5 days ago',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
        {
            id: 2,
            name: 'Adam from The Mayor\'s Office',
            message: 'Hey Peter, we\'ve got a new user research opportunity for you. Adam from The Mayor\'s Office is looking for people like you.',
            time: '1 month ago',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
        {
            id: 3,
            name: 'Neil',
            message: 'Hey Peter, we\'ve got a new user research opportunity for you. Neil is looking for people like you.',
            time: '1 month ago',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
        {
            id: 4,
            name: 'Quagmire from Giggity Co.',
            message: 'Hey Peter, we\'ve got a new user research opportunity for you. Quagmire from Giggity Co. is looking for people like you.',
            time: '1 month ago',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
        {
            id: 5,
            name: 'Herbert from Children\'s Program',
            message: 'Hey Peter, we\'ve got a new side project opportunity for you. Herbert from Children\'s Program is looking for people like you.',
            time: '1 month ago',
            avatar: 'https://images.unsplash.com/photo-1544502062-f82887f03d1c?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
        {
            id: 6,
            name: 'Cleveland from The Post Office',
            message: 'Hey Peter, we\'ve got a new side project opportunity for you. Cleveland from The Post Office is looking for people like you.',
            time: '2 months ago',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            read: false,
        },
    ]);

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    return (
        <div className=" min-h-screen py-10 px-4 sm:px-8 font-sans flex justify-center">
            <div className="w-full ">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Notifications</h1>
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 text-[15px] font-medium text-[#2C2C2C] hover:text-black transition-colors"
                    >
                        Mark All Read
                        <CheckCheck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-[#EBEBEB] rounded-lg overflow-hidden shadow-sm">
                    {notifications.map((notif, index) => (
                        <div
                            key={notif.id}
                            className={`flex gap-4 p-5 sm:p-6 ${
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
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Notifications;