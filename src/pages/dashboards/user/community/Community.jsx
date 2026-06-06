import React from 'react';
import { Users, MessageSquare, ChevronRight } from 'lucide-react';

const Community = () => {
  const activities = [
    { 
      id: 1, 
      type: 'joined', 
      message: 'You joined "Richmond Football Group"',
      icon: Users,
      time: '2 hours ago'
    },
    { 
      id: 2, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '5 hours ago'
    },
    { 
      id: 3, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '1 day ago'
    },
    { 
      id: 4, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '2 days ago'
    },
    { 
      id: 5, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '3 days ago'
    },
    { 
      id: 6, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '4 days ago'
    },
    { 
      id: 7, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '5 days ago'
    },
    { 
      id: 8, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '1 week ago'
    },
    { 
      id: 9, 
      type: 'reply', 
      message: 'Mark replied to your comment',
      icon: MessageSquare,
      time: '2 weeks ago'
    },
  ];

  return (
    <div className="dashboardPy dashboardSpaceY">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Community</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className={`flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                index !== activities.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="shrink-0">
                  <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-gray-900">{activity.message}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
              <ChevronRight className="shrink-0 w-5 h-5 text-gray-400" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
