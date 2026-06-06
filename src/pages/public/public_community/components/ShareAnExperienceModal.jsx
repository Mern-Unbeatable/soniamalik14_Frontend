
import React, { useState } from 'react';

const ShareAnExperienceModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const [threadTitle, setThreadTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);

    const sports = ['Football', 'Squash', 'Rugby', 'Netball', 'Cricket', 'Padel', 'Tennis', 'Badminton', 'Golf', 'Running', 'General'];
    const topics = ['New to sport', 'Returning to sport', 'Finding a club', 'Nerves & confidence', 'Injury', 'Hormonal health', 'Kit & gear', 'General'];

    const handleTopicToggle = (topic) => {
        setSelectedTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const handleSubmit = async () => {
        if (threadTitle.trim() && description.trim() && selectedSport && selectedTopics.length > 0) {
            const success = await onSubmit({
                threadTitle,
                description,
                sport: selectedSport,
                topics: selectedTopics,
            });

            if (!success) {
                return;
            }

            setThreadTitle('');
            setDescription('');
            setSelectedSport('');
            setSelectedTopics([]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Switched to flex flex-col to allow middle content to scroll */}
            <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] flex flex-col">
                
                {/* Header - Made non-shrinkable */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200 shrink-0 gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Share An Experience</h2>
                        <p className="text-sm text-gray-600 mt-1">Ask a question, share an experience, or start a conversation with the ESSA community.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Content - flex-1 allows it to take remaining space, overflow-y-auto makes it scroll */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Thread Title */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Your question or topic</label>
                        <input
                            type="text"
                            placeholder="What is your post about?"
                            value={threadTitle}
                            onChange={(e) => setThreadTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary bg-gray-50"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Your post</label>
                        <textarea
                            placeholder="Write your message here."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary resize-none bg-gray-50"
                        />
                    </div>

                    {/* Sport Selection */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Sport</label>
                        <select
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary bg-gray-50"
                        >
                            <option value="">Select a sport</option>
                            {sports.map((sport) => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>

                    {/* Topic Selection */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Topic</label>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => handleTopicToggle(topic)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedTopics.includes(topic)
                                        ? 'bg-btn-primary text-white'
                                        : 'bg-[#91C0BC] text-gray-700 hover:bg-[#7db0ac]'
                                        }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Made non-shrinkable */}
                <div className="px-6 py-4 border-t border-gray-200 shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !threadTitle.trim() || !description.trim() || !selectedSport || selectedTopics.length === 0}
                        className="w-full px-4 py-3 bg-btn-primary text-white font-semibold rounded-lg hover:bg-[#0d655d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareAnExperienceModal;