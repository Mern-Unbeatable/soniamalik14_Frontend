import React from 'react';

const ContactOrganiser = ({ message, onMessageChange, onSendMessage }) => {
  return (
    <section>
      <h3 className="mb-3 text-[20px] font-semibold leading-8 text-black">Contact Organiser</h3>
      <div className="rounded-[14px] bg-secondary p-4">
        <p className="mb-2 text-lg text-[#4a5565]">Ask the organiser a question</p>

        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Write your message"
          rows={12}
          className="w-full resize-none rounded-md border border-[#9ec9c7] bg-[#a9cdca] p-3 text-[14px] text-[#1f2937] outline-none placeholder:text-[#5f7e7c] focus:border-[#0F766E]"
        />

        <button
          onClick={onSendMessage}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#0F766E] px-4 py-2 text-base font-medium text-white transition hover:bg-[#0c5e58]"
        >
          Send message
        </button>
      </div>
    </section>
  );
};

export default ContactOrganiser;
