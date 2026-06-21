import React from 'react';

const EventInteractionSection = ({ allowsBooking, allowsRegisterInterest, allowsQuestions }) => {
  return (
    <>
      <div className="flex flex-wrap gap-4 pt-4">
        {allowsBooking && (
          <button
            className="bg-btn-primary rounded-lg px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-50"
          >
            Register
          </button>
        )}
        {allowsRegisterInterest && (
          <button
            className="bg-btn-primary rounded-lg px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-50"
          >
            Register Interest
          </button>
        )}
      </div>

      <div
        className={`mt-6 max-w-lg rounded-lg border border-gray-100 bg-[#E7F1F1] p-4 ${!allowsQuestions ? 'opacity-60' : ''}`}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">Contact Organizer</h2>
        <p className="mb-3 text-lg font-medium text-gray-700">Ask the organiser a question</p>
        <textarea
          className="focus:ring-btn-primary/20 mb-4 h-32 w-full resize-none rounded-lg border-none bg-[#B5D5D2]/50 p-3 text-base text-gray-700 placeholder-gray-500 outline-none focus:ring-2"
          placeholder="Write your message"
          disabled={!allowsQuestions}
        ></textarea>
        <button
          className="rounded-lg bg-[#0F766E] px-6 py-2.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-50"
          disabled={!allowsQuestions}
        >
          Contact organiser
        </button>
      </div>
    </>
  );
};

export default EventInteractionSection;
