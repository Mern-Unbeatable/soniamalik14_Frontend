import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const EventInfo = ({ item }) => {
    return (
        <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

            <div className="text-base md:w-2xl text-gray-600 leading-relaxed whitespace-pre-line mb-8">{item.description}</div>

            <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 text-base text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{item.date}</span>
                </div>
                <div className="flex items-center gap-3 text-base text-gray-700">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{item.time}</span>
                </div>
            </div>

            <div className="space-y-4 text-base text-gray-800 mb-8">
                <div>
                    <span className="font-bold block text-gray-900">Age Group:</span>
                    <span>{item.ageGroup}</span>
                </div>
                <div>
                    <span className="font-bold block text-gray-900">Sport Type:</span>
                    <span>{item.sportType}</span>
                </div>
                <div>
                    <span className="font-bold block text-gray-900">Skill Level:</span>
                    <span>{item.skillLevel}</span>
                </div>
                <div>
                    <span className="font-bold block text-gray-900">Last Date to Register</span>
                    <span>{item.lastDateToRegister}</span>
                </div>
            </div>
        </div>
    );
};

export default EventInfo;
