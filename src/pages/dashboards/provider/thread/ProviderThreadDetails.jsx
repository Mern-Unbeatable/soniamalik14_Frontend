import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProviderThreadDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const thread = location.state?.thread || {
        id,
        author: 'Unknown',
        title: 'Thread',
        description: 'No description available.',
    };

    // sample replies - in future, fetch real replies by thread id
    const replies = [
        { id: 1, author: thread.author, content: 'I usually train for 40â€“45 minutes a day, focusing on ball control and passing.' },
        { id: 2, author: thread.author, content: 'Morning stretching and light cardio have really improved my flexibility.' },
        { id: 3, author: thread.author, content: 'Watching professional matches helps with positioning and decision-making.' },
        { id: 4, author: thread.author, content: 'Practice shooting accuracy at home using cones and targets.' },
    ];
    return (
        <div className="dashboardPy dashboardSpaceY ">
            <div className="">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-teal-600 text-base mb-4 "
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-lg p-6 shadow-sm mb-6 sm:w-md">
                    <div className="text-xs font-medium text-gray-500 mb-2">{thread.author}</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{thread.title}</h1>
                    <p className="text-base text-gray-600 leading-relaxed">{thread.description}</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm sm:w-md">
                    <h3 className="text-lg font-semibold mb-4">Reply</h3>
                    <div className="space-y-4">
                        {replies.map((r) => (
                            <div key={r.id} className="bg-[#F4F4F4] border border-gray-100 rounded p-4">
                                <div className="text-xs font-medium text-gray-500 mb-2">{r.author}</div>
                                <div className="text-base text-gray-700">{r.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderThreadDetails
