import React from 'react';
import { Calendar, Clock, Eye, ExternalLink, MessageSquare, TrendingUp } from 'lucide-react';

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
        <div className="mb-6 flex items-center gap-4 text-base font-medium text-gray-500">
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
            <ExternalLink className="h-4 w-4" /> {participants ?? 0}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Sport</h3>
          <p className="text-base text-gray-600">{sportType || 'N/A'}</p>
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Event Type</h3>
          <p className="text-base text-gray-600">{eventType}</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
          {description || 'No description added.'}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3 text-base text-gray-700">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span>{dateValue}</span>
        </div>
        <div className="flex items-center gap-3 text-base text-gray-700">
          <Clock className="h-5 w-5 text-gray-400" />
          <span>{timeValue}</span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Who is suitable for</h3>
          <p className="text-base text-gray-600">{suitableForValue}</p>
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Age Group:</h3>
          <p className="text-base text-gray-600">{ageGroupValue}</p>
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Sport Type:</h3>
          <p className="text-base text-gray-600">{sportType || 'N/A'}</p>
        </div>
        <div>
          <h3 className="mb-1 text-base font-bold text-gray-900">Skill Level:</h3>
          <p className="text-base text-gray-600">{skillLevel}</p>
        </div>
      </div>
    </>
  );
};

export default EventOverviewSection;
