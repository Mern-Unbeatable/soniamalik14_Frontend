import React from 'react';

const ContactOrganiser = ({ disabled = false }) => {
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (disabled) return;
        alert('Message sent — demo only');
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Contact Organiser</h3>
            <div className="bg-[#E7F1F1] p-4 rounded-lg h-auto md:h-100 flex flex-col">
                <p className="text-base mb-4 text-[#1A1D1F]">Ask the organiser a question</p>
                <form onSubmit={handleSendMessage} className="flex flex-col flex-1">
                    <textarea
                        disabled={disabled}
                        className="w-full flex-1 bg-[#B5D5D2] rounded-xl p-4 text-base text-[#1A1D1F] placeholder-gray-500/70 border-none focus:ring-1 focus:ring-[#147B6B] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed resize-none mb-4"
                        placeholder="Write your message"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={disabled}
                        className="bg-[#0F766E] hover:bg-[#0D655D] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit"
                    >
                        Send message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactOrganiser;
