import React from 'react';
import { CalendarDays, Target, Trophy, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../utils/storage';

const SessionOverview = ({ event, onBookPlace }) => {
  if (!event) return null;

  const overviewItems = [
    { label: 'Sport', value: event.sportType || 'Football', icon: Trophy },
    { label: 'Event Type', value: event.eventType || 'Training Camp', icon: CalendarDays },
    { label: 'Suitable For', value: event.skillLevel || 'New to the sport', icon: Target },
    {
      label: "Women's only",
      value: typeof event.womensOnly === 'boolean' ? (event.womensOnly ? 'Yes' : 'No') : event.womensOnly || 'No',
      icon: Users,
    },
  ];

  const authUser = useSelector((state) => state.auth?.user);
  const currentUser = authUser || getUser();
  const normalizedRole = String(currentUser?.role || '').trim().toLowerCase();
  const isDisabled = normalizedRole === 'coach' || normalizedRole === 'provider';

  return (
    <section>
      <h3 className="mb-3 text-[20px] font-semibold leading-8 text-black">Session Overview</h3>
      <div className="space-y-3">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F1F1] text-[#0F766E]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[16px] font-medium leading-6 text-[#101828]">{item.label}</p>
                  <p className="text-[16px] leading-6 text-[#4a5565]">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => { if (!isDisabled) onBookPlace && onBookPlace(); }}
          disabled={isDisabled}
          className={`rounded-md px-3 py-2.5 text-[14px] font-medium text-white transition ${isDisabled ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'bg-[#0F766E] hover:bg-[#0c5e58]'}`}
        >
          Book Your Place
        </button>
        <button
          disabled={isDisabled}
          className={`rounded-md px-3 py-2.5 text-[14px] font-medium text-white transition ${isDisabled ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'bg-[#0F766E] hover:bg-[#0c5e58]'}`}
        >
          Register Interest
        </button>
      </div>
    </section>
  );
};

export default SessionOverview;
