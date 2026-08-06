import React from 'react';
import {
  Award,
  Calendar,
  CalendarDays,
  Clock,
  Eye,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react';

const OverviewCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-base font-semibold text-gray-900">{label}</p>
      <p className="text-base text-gray-500">{value}</p>
    </div>
  </div>
);

const EventOverviewSection = ({
  title,
  views,
  trend,
  messages,
  participants,
  sportType,
  eventType,
  description,
  dateValue,
  timeValue,
  suitableForValue,
  ageGroupValue,
  skillLevel,
}) => {
  return (
    <>
      <div>
        <h1 className="mb-3 text-2xl font-semibold text-gray-900 md:text-3xl">
          {title || 'Untitled Event'}
        </h1>
        {/* <div className="mb-6 flex items-center gap-4 text-base font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {views ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> {trend ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> {messages ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <ExternalLink className="h-4 w-4" /> {participants ?? 10}
          </span>
        </div> */}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Event Details</h2>
        <p className="text-base text-[#000000] leading-relaxed whitespace-pre-line xl:max-w-6xl">
          {description || 'No description added.'}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Overview</h2>
        <div className="space-y-3">
          <OverviewCard icon={Award} label="Sport" value={sportType || 'N/A'} />
          <OverviewCard icon={CalendarDays} label="Event Type" value={eventType || 'N/A'} />
          <OverviewCard icon={Calendar} label="Date" value={dateValue} />
          <OverviewCard icon={Clock} label="Time" value={timeValue} />
          <OverviewCard icon={Users} label="Who is suitable for" value={suitableForValue} />
          <OverviewCard icon={Users} label="Age Group" value={ageGroupValue} />
          <OverviewCard icon={TrendingUp} label="Skill Level" value={skillLevel} />
        </div>
      </div>
    </>
  );
};

export default EventOverviewSection;
