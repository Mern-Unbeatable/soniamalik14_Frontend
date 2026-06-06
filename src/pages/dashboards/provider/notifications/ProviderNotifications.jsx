import React, { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import notificationsSeed from '../../../../data/providerNotificationsData.json';

const ProviderNotifications = () => {
  const [notifications, setNotifications] = useState(notificationsSeed);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="dashboardPy">
      <section className=" ">
        <div className="flex items-center justify-between  px-5 py-4">
          <h1 className="text-xl font-semibold text-[#1D1D1D]">Notifications</h1>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 text-base font-medium text-[#1D1D1D] hover:text-[#0F766E]"
          >
            <span>Mark All Read</span>
            <CheckCheck className="h-5 w-5" />
          </button>
        </div>

        <div className=" divide-y divide-[#767676] rounded-lg overflow-hidden">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex gap-3 px-4 py-4 md:gap-4 md:px-5 md:py-6.5  ${notification.read ? 'bg-[#E8E8E8]' : 'bg-[#E8E8E8]'}`}
            >
              <img
                src={notification.avatar}
                alt={notification.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-[#2F3B3A] md:text-base">
                  <span className="font-semibold text-[#1D1D1D]">{notification.name}</span>{' '}
                  <span>{notification.message}</span>
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">{notification.time}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderNotifications;
