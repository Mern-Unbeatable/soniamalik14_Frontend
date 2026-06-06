import React, { useState } from 'react';

const AddPostModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const [threadTitle, setThreadTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedHelps, setSelectedHelps] = useState([]);

    const sports = ['Football', 'Squash', 'Rugby', 'Netball', 'Cricket', 'Padel', 'Tennis', 'Badminton', 'Golf', 'Running', 'General'];
    const helpTypes = ['Sub', 'Referee', 'Player Cover', 'Volunteer', 'Other'];

    const handleHelpToggle = (help) => {
        setSelectedHelps((prev) =>
            prev.includes(help) ? prev.filter((h) => h !== help) : [...prev, help]
        );
    };

    const handleSubmit = async () => {
        if (threadTitle.trim() && description.trim() && selectedSport && location.trim() && date && selectedHelps.length > 0) {
            const success = await onSubmit({
                threadTitle,
                description,
                sport: selectedSport,
                location,
                date,
                time,
                helps: selectedHelps,
            });

            if (!success) {
                return;
            }

            setThreadTitle('');
            setDescription('');
            setSelectedSport('');
            setLocation('');
            setDate('');
            setTime('');
            setSelectedHelps([]);
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
                        <h2 className="text-xl font-semibold text-gray-900">Start a Discussion</h2>
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary resize-none"
                        />
                    </div>

                    {/* Sport Selection */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Sport</label>
                        <select
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
                        >
                            <option value="">Select a sport</option>
                            {sports.map((sport) => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-btn-primary"
                            />
                        </div>
                    </div>

                    {/* What kind of help */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">What kind of help do you need?</label>
                        <div className="flex flex-wrap gap-2">
                            {helpTypes.map((help) => (
                                <button
                                    key={help}
                                    onClick={() => handleHelpToggle(help)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedHelps.includes(help)
                                        ? 'bg-btn-primary text-white'
                                        : 'bg-[#91C0BC] text-gray-700 hover:bg-[#7db0ac]'
                                        }`}
                                >
                                    {help}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Made non-shrinkable */}
                <div className="px-6 py-4 border-t border-gray-200 shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !threadTitle.trim() || !description.trim() || !selectedSport || !location.trim() || !date || selectedHelps.length === 0}
                        className="w-full px-4 py-3 bg-btn-primary text-white font-semibold rounded-lg hover:bg-[#0d655d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPostModal;