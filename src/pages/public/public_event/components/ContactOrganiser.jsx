import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { POST } from '../../../../services/httpMethods';

const ContactOrganiser = ({ event }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = String(message || '').trim();
    const eventId = event?.id;
    const recipientId = event?.organizerId;

    if (!eventId || !recipientId) {
      setMessageStatus('Unable to send message. Organiser information is missing.');
      return;
    }

    if (!trimmedMessage) {
      setMessageStatus('Please write a message before sending.');
      return;
    }

    setIsSending(true);
    setMessageStatus('');

    try {
      const response = await POST(`/api/events/${eventId}/messages`, {
        recipientId,
        message: trimmedMessage,
      });

      setMessage('');
      setMessageStatus('');
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response?.data?.message || response?.message,
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0F766E',
      });
    } catch (error) {
      setMessageStatus(error?.response?.data?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  if (!event) return null;

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Contact Organiser</h3>
      <div className="flex h-105 flex-col rounded-lg bg-[#E7F1F1] p-4">
        <p className="mb-4 text-base text-[#1A1D1F]">Ask the organiser a question</p>
        <form onSubmit={handleSendMessage} className="flex flex-1 flex-col">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-4 w-full flex-1 resize-none rounded-xl border-none bg-[#B5D5D2] p-4 text-base text-[#1A1D1F] placeholder-[#4A5565] focus:ring-1 focus:ring-[#147B6B]"
            placeholder="Write your message"
            disabled={isSending}
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSending}
            className="w-fit rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:bg-[#7AA7A2]"
          >
            {isSending ? 'Sending...' : 'Send message'}
          </button>
        </form>
        {messageStatus && <p className="mt-2 text-xs text-[#147B6B]">{messageStatus}</p>}
      </div>
    </div>
  );
};

export default ContactOrganiser;
