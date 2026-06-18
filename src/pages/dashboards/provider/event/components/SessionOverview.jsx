import React, { useState } from 'react';
import { CalendarDays, Target, Trophy, Users, Copy, Check, ExternalLink } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../utils/storage';

const SessionOverview = ({ event, onBookPlace }) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopy = () => {
    if (event.bookingLink) {
      navigator.clipboard.writeText(event.bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

      {event.bookingLink && (
        <div className="mt-4 rounded-[14px] border border-[#e5e7eb] bg-white p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F1F1] text-[#0F766E]">
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-[16px] font-medium leading-6 text-[#101828]">Booking Link</p>
            </div>
            {!(event?.status === 'PENDING_APPROVAL' || event?.status === 'PENDING') && (
              <button
                onClick={handleCopy}
                className="text-[#0F766E] hover:text-[#0c5e58] text-sm font-medium flex items-center gap-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
          {event?.status === 'PENDING_APPROVAL' || event?.status === 'PENDING' ? (
            <p className="mt-2 text-sm text-gray-500 font-medium italic">
              You can share your link after admin approved
            </p>
          ) : (
            <div className="bg-[#f8fafc] rounded-lg p-2.5 text-xs text-gray-500 font-mono break-all border border-[#f1f5f9] select-all">
              {event.bookingLink}
            </div>
          )}
        </div>
      )}

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
