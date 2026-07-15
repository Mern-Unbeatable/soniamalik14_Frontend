import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { POST } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ApplicantModal = ({ enquiry, serviceId, onClose }) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  if (!enquiry) return null;

  const extractUuid = (value) => {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    const uuidMatch = value.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
    );
    return uuidMatch?.[0] || null;
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    const trimmed = String(replyText || '').trim();
    if (!trimmed) return;

    const resolveParentId = (row) => {
      const lastMessageValue = row?.lastMessage;
      const lastMessageIdFromObject =
        lastMessageValue?.id ||
        lastMessageValue?._id ||
        lastMessageValue?.messageId ||
        lastMessageValue?.uuid ||
        null;

      if (lastMessageIdFromObject) return extractUuid(String(lastMessageIdFromObject));

      if (typeof lastMessageValue === 'string') {
        const lastMessageUuid = extractUuid(lastMessageValue);
        if (lastMessageUuid) return lastMessageUuid;
      }

      const parentIdFromReply = extractUuid(String(row?.parentId || ''));
      if (parentIdFromReply) return parentIdFromReply;

      return (
        extractUuid(String(row?.messageId || '')) ||
        extractUuid(String(row?.id || '')) ||
        extractUuid(String(row?._id || '')) ||
        extractUuid(String(row?.uuid || '')) ||
        null
      );
    };

    const parentId = resolveParentId(enquiry);

    if (!serviceId) {
      toast.error('Service ID is missing.');
      return;
    }
    if (!parentId) {
      toast.error('Parent message ID is missing.');
      return;
    }

    try {
      setSending(true);
      const response = await POST(ENDPOINT.SERVICES.MESSAGES(serviceId), {
        message: trimmed,
        parentId,
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
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Type your reply here..."
              disabled={sending}
              rows={3}
              className="flex-1 resize-none rounded-lg border border-gray-200 p-3 text-base outline-none focus:ring-1 focus:ring-[#0F766E]"
              required
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-50"
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
