import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { POST } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ApplicantModal = ({ enquiry, serviceId, onClose }) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  if (!enquiry) return null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    const trimmed = String(replyText || '').trim();
    if (!trimmed) return;

    const recipientId =
      enquiry?.senderId ||
      enquiry?.sender?.id ||
      enquiry?.userId ||
      enquiry?.user?.id ||
      enquiry?.sender?.Id;

    if (!serviceId) {
      toast.error('Service ID is missing.');
      return;
    }
    if (!recipientId) {
      toast.error('Recipient ID is missing.');
      return;
    }

    try {
      setSending(true);
      const response = await POST(ENDPOINT.SERVICES.MESSAGES(serviceId), {
        recipientId,
        message: trimmed,
      });
      toast.success(response?.data?.message || 'Reply sent successfully!');
      setReplyText('');
      onClose();
    } catch (err) {
      console.error('Reply send error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative mx-2 w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <button
          className="absolute top-5 right-5 rounded-full p-2 hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
        <h2 className="mb-2 text-xl font-semibold">Applicant Details</h2>
        <div className="mb-2 text-lg font-semibold text-gray-900">{enquiry.name}</div>
        <div className="mb-1 text-base font-semibold text-gray-900">{enquiry.phone}</div>
        <div className="mb-1 text-base font-semibold text-gray-900">{enquiry.email}</div>
        {enquiry.event && (
          <div className="mb-3 text-base font-semibold text-gray-900">
            Event Name: <span className="font-semibold">{enquiry.event}</span>
          </div>
        )}
        <div className="mb-2 text-[16px] whitespace-pre-line text-gray-800">{enquiry.msg}</div>
        {enquiry.date && <div className="mt-2 text-sm text-gray-500">{enquiry.date}</div>}

        {/* Reply form */}
        <form onSubmit={handleSendReply} className="mt-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reply to Applicant
          </label>
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              disabled={sending}
              rows={3}
              className="flex-1 rounded-lg border border-gray-200 p-3 text-base outline-none focus:ring-1 focus:ring-[#0F766E] resize-none"
              required
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {sending ? 'Sending...' : 'Send Reply'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantModal;
