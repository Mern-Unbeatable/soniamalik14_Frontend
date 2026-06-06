import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const ProviderThread = () => {
    const [threads, setThreads] = useState([
            {
                id: 1,
                author: 'Rishi Edwards',
                title: 'Training Tips & Daily Practice',
                description: 'Discuss drills, fitness routines, and match-day preparation.',
                replies: 4
            },
            {
                id: 2,
                author: 'Rishi Edwards',
                title: 'Match Experience & Learnings',
                description: 'Share match stories, key moments, and lessons learned on the field.',
                replies: 4
            },
            {
                id: 3,
                author: 'Rishi Edwards',
                title: 'Injury Recovery & Player Care',
                description: 'Talk about injury prevention, recovery tips, and player health.',
                replies: 4
            },
            {
                id: 4,
                author: 'Rishi Edwards',
                title: 'Players Needed for Our Team',
                description: 'Post trial details, required positions, and team information.',
                replies: 4
            }
        ]);
    
  return (
    <div className=" dashboardPy dashboardSpaceY">
            <div className="max-w-2xl ">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
                        <p className="text-gray-600 text-base">Connect, chat, and support each other.</p>
                    </div>

                </div>

                {/* Threads List */}
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <Link
                            key={thread.id}
                            to={`/provider/thread/${thread.id}`}
                            state={{ thread }}
                            className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Author */}
                            <div className="text-base font-medium text-gray-500 mb-3">
                                {thread.author}
                            </div>

                            {/* Title */}
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                {thread.title}
                            </h2>

                            {/* Description */}
                            <p className="text-base text-gray-600 mb-4">
                                {thread.description}
                            </p>

                            {/* Reply Count */}
                            <div className="flex items-center text-gray-500 text-base">
                                <MessageSquare
                                 size={16} className="mr-2" />
                                <span>{thread.replies} Reply</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


        </div>
  )
}

export default ProviderThread
