import React from 'react';

const ContactOrganiser = ({ disabled = false }) => {
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (disabled) return;
        alert('Message sent — demo only');
    };

    return (
        <div className="flex h-full min-w-0 flex-col">
            <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Contact Organiser</h3>
            <div className="flex min-h-[280px] flex-1 flex-col rounded-lg bg-[#E7F1F1] p-4 md:min-h-[320px]">
                <p className="mb-4 text-base text-[#1A1D1F]">Ask the organiser a question</p>
                <form onSubmit={handleSendMessage} className="flex flex-1 flex-col">
                    <textarea
                        disabled={disabled}
                        className="mb-4 min-h-[140px] w-full flex-1 resize-none rounded-xl border-none bg-[#B5D5D2] p-4 text-base text-[#1A1D1F] placeholder-gray-500/70 focus:ring-1 focus:ring-[#147B6B] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                        placeholder="Write your message"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={disabled}
                        className="w-fit rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Send message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactOrganiser;
