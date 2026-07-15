// import React, { useEffect, useMemo, useState } from 'react';
// import { MessageCircle, MessageSquareText, Reply, Clock3 } from 'lucide-react';
// import { GET } from '../../../../services/httpMethods';
// import { ENDPOINT } from '../../../../services/httpEndpoint';

// const FALLBACK_AVATAR =
//   'https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

// const formatDateTime = (value) => {
//   if (!value) return 'Time unavailable';
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return 'Time unavailable';

//   return date.toLocaleString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// };

// const timeAgo = (value) => {
//   if (!value) return '';
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return '';

//   const diffMs = Date.now() - date.getTime();
//   const minutes = Math.floor(diffMs / 60000);

//   if (minutes < 1) return 'just now';
//   if (minutes < 60) return `${minutes}m ago`;

//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;

//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;

//   const weeks = Math.floor(days / 7);
//   return `${weeks}w ago`;
// };

// const normalizeConversation = (item, index) => {
//   const service = item?.service || {};
//   const provider = service?.provider || {};
//   const lastMessage = item?.lastMessage || {};
//   const replies = Array.isArray(lastMessage?.replies) ? lastMessage.replies : [];

//   return {
//     id: item?.id || service?.id || `conversation-${index}`,
//     serviceId: service?.id || '',
//     serviceTitle: service?.listingHeadline || 'Untitled service',
//     serviceLogo: service?.logo || '',
//     providerName: provider?.name || 'Provider',
//     providerAvatar: provider?.avatar || FALLBACK_AVATAR,
//     unreadCount: Number(item?.unreadCount || 0),
//     totalMessages: Number(item?.totalMessages || 0),
//     lastMessageText: lastMessage?.message || 'No message available.',
//     lastMessageTime: lastMessage?.createdAt || '',
//     lastMessageSender: lastMessage?.sender?.name || 'Unknown',
//     replies: replies.map((reply, replyIndex) => ({
//       id: reply?.id || `${service?.id || index}-reply-${replyIndex}`,
//       text: reply?.message || 'No reply text',
//       senderName: reply?.sender?.name || 'Unknown',
//       createdAt: reply?.createdAt || '',
//     })),
//   };
// };

// const Insights = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [conversations, setConversations] = useState([]);

//   useEffect(() => {
//     const controller = new AbortController();

//     const loadConversations = async () => {
//       setLoading(true);
//       setError('');

//       try {
//         const response = await GET(ENDPOINT.SERVICES.MY_CONVERSATIONS, {}, controller.signal);
//         const rows =
//           response?.data?.data?.conversations ||
//           response?.data?.conversations ||
//           response?.data?.data ||
//           [];

//         const safeRows = Array.isArray(rows) ? rows : [];
//         const mappedRows = safeRows
//           .map((item, index) => normalizeConversation(item, index))
//           .sort((a, b) => {
//             const first = new Date(a.lastMessageTime || 0).getTime();
//             const second = new Date(b.lastMessageTime || 0).getTime();
//             return second - first;
//           });
//         setConversations(mappedRows);
//       } catch (err) {
//         if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
//         setError(err?.response?.data?.message || 'Failed to load insights.');
//         setConversations([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadConversations();

//     return () => controller.abort();
//   }, []);

//   const totals = useMemo(() => {
//     return conversations.reduce(
//       (acc, item) => {
//         acc.unread += item.unreadCount;
//         acc.messages += item.totalMessages;
//         acc.replies += item.replies.length;
//         return acc;
//       },
//       { unread: 0, messages: 0, replies: 0 }
//     );
//   }, [conversations]);

//   return (
//     <section className="dashboardPy dashboardSpaceY">


//       {loading && (
//         <div className="rounded-xl border border-[#E2E8EA] bg-white px-5 py-10 text-center text-[#4B5563]">
//           Loading insights...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center text-red-600">
//           {error}
//         </div>
//       )}

//       {!loading && !error && conversations.length === 0 && (
//         <div className="rounded-xl border border-[#E2E8EA] bg-white px-5 py-10 text-center text-[#6B7280]">
//           No conversation insights found yet.
//         </div>
//       )}

//       {!loading && !error && conversations.length > 0 && (
//         <div className="grid grid-cols-1 gap-4">
//           {conversations.map((conversation) => (
//             <article
//               key={conversation.id}
//               className="rounded-xl border border-[#E2E8EA] bg-white p-4 shadow-sm"
//             >
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                 <div className="flex min-w-0 items-start gap-3">
//                   <img
//                     src={conversation.serviceLogo || conversation.providerAvatar || FALLBACK_AVATAR}
//                     alt={conversation.serviceTitle}
//                     className="h-14 w-14 rounded-lg object-cover"
//                   />
//                   <div className="min-w-0">
//                     <h2 className="truncate text-lg font-semibold text-[#1D1D1D]">
//                       {conversation.serviceTitle}
//                     </h2>
//                     <p className="mt-1 text-sm text-[#4B5563]">
//                       Provider: <span className="font-medium">{conversation.providerName}</span>
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2 text-xs">
//                   <span className="inline-flex items-center rounded-full bg-[#EAF3FF] px-3 py-1 font-semibold text-[#1D4ED8]">
//                     {conversation.totalMessages} message{conversation.totalMessages === 1 ? '' : 's'}
//                   </span>
//                   {conversation.unreadCount > 0 && (
//                     <span className="inline-flex items-center rounded-full bg-[#FFF5E8] px-3 py-1 font-semibold text-[#B45309]">
//                       {conversation.unreadCount} unread
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-4 rounded-lg border border-[#E2E8EA] bg-[#F8FAFB] p-3">
//                 <div className="flex flex-wrap items-center gap-2 text-sm text-[#4B5563]">
//                   <MessageSquareText className="h-4 w-4 text-[#0F766E]" />
//                   <span className="font-semibold text-[#1D1D1D]">Last Message</span>
//                   <span className="text-[#9CA3AF]">by {conversation.lastMessageSender}</span>
//                 </div>
//                 <p className="mt-2 text-sm leading-6 text-[#1F2937]">{conversation.lastMessageText}</p>
//                 <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
//                   <span className="inline-flex items-center gap-1">
//                     <Clock3 className="h-3.5 w-3.5" />
//                     {formatDateTime(conversation.lastMessageTime)}
//                   </span>
//                   <span>{timeAgo(conversation.lastMessageTime)}</span>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <div className="mb-2 flex items-center gap-2">
//                   <MessageCircle className="h-4 w-4 text-[#0F766E]" />
//                   <p className="text-sm font-semibold text-[#1D1D1D]">Replies</p>
//                 </div>

//                 {conversation.replies.length === 0 ? (
//                   <p className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#FCFCFC] px-3 py-2 text-sm text-[#6B7280]">
//                     No replies yet.
//                   </p>
//                 ) : (
//                   <div className="space-y-2">
//                     {conversation.replies.map((reply) => (
//                       <div
//                         key={reply.id}
//                         className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2"
//                       >
//                         <p className="text-sm text-[#1F2937]">{reply.text}</p>
//                         <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
//                           <span className="inline-flex items-center gap-1">
//                             <Reply className="h-3.5 w-3.5" />
//                             {reply.senderName}
//                           </span>
//                           <span>{formatDateTime(reply.createdAt)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </article>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default Insights;


import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Clock3, Inbox } from 'lucide-react';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';

const FALLBACK_AVATAR =
  'https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

const formatDateTime = (value) => {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const timeAgo = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
};

const normalizeConversation = (item, index) => {
  const service = item?.service || {};
  const provider = service?.provider || {};
  const lastMessage = item?.lastMessage || {};
  const replies = Array.isArray(lastMessage?.replies) ? lastMessage.replies : [];

  return {
    id: item?.id || service?.id || `conversation-${index}`,
    serviceId: service?.id || '',
    serviceTitle: service?.listingHeadline || 'Untitled service',
    serviceLogo: service?.logo || '',
    providerName: provider?.name || 'Provider',
    providerAvatar: provider?.avatar || FALLBACK_AVATAR,
    unreadCount: Number(item?.unreadCount || 0),
    totalMessages: Number(item?.totalMessages || 0),
    lastMessageText: lastMessage?.message || 'No message available.',
    lastMessageTime: lastMessage?.createdAt || '',
    lastMessageSender: lastMessage?.sender?.name || 'Unknown',
    replies: replies.map((reply, replyIndex) => ({
      id: reply?.id || `${service?.id || index}-reply-${replyIndex}`,
      text: reply?.message || 'No reply text',
      senderName: reply?.sender?.name || 'Unknown',
      createdAt: reply?.createdAt || '',
    })),
  };
};

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const ConversationRow = ({ conversation, isOpen, onToggle }) => {
  const hasReplies = conversation.replies.length > 0;
  const avatarSrc = conversation.serviceLogo || conversation.providerAvatar || FALLBACK_AVATAR;

  return (
    <li className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={() => hasReplies && onToggle(conversation.id)}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 sm:px-5"
      >
        <div className="relative shrink-0">
          <img
            src={avatarSrc}
            alt=""
            className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-100"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
          {conversation.unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white ring-2 ring-white">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={`truncate text-base ${
                conversation.unreadCount > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'
              }`}
            >
              {conversation.serviceTitle}
            </h3>
            <span className="shrink-0 text-sm text-slate-400">
              {timeAgo(conversation.lastMessageTime)}
            </span>
          </div>

          <p className="mt-0.5 truncate text-sm text-slate-400">{conversation.providerName}</p>

          <div className="mt-1 flex items-center gap-1.5">
            <p
              className={`truncate text-sm md:text-base ${
                conversation.unreadCount > 0 ? 'text-slate-700' : 'text-slate-500'
              }`}
            >
              <span className="text-slate-400">{conversation.lastMessageSender}: </span>
              {conversation.lastMessageText}
            </p>
          </div>

          <div className="mt-1.5 flex items-center gap-3 text-sm text-slate-400">
            <span>{conversation.totalMessages} message{conversation.totalMessages === 1 ? '' : 's'}</span>
            {hasReplies && (
              <span className="flex items-center gap-1">
                {conversation.replies.length} repl{conversation.replies.length === 1 ? 'y' : 'ies'}
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </span>
            )}
          </div>
        </div>
      </button>

      {hasReplies && isOpen && (
        <div className="space-y-2 border-t border-slate-50 bg-slate-50/60 px-4 py-3 sm:px-5 sm:pl-[4.25rem]">
          {conversation.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <p className="text-slate-600 text-base">
                <span className="font-medium text-slate-700">{reply.senderName}: </span>
                {reply.text}
              </p>
              {/* <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <Clock3 className="h-3 w-3" />
                {formatDateTime(reply.createdAt)}
              </span> */}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadConversations = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await GET(ENDPOINT.SERVICES.MY_CONVERSATIONS, {}, controller.signal);
        const rows =
          response?.data?.data?.conversations ||
          response?.data?.conversations ||
          response?.data?.data ||
          [];

        const safeRows = Array.isArray(rows) ? rows : [];
        const mappedRows = safeRows
          .map((item, index) => normalizeConversation(item, index))
          .sort((a, b) => {
            const first = new Date(a.lastMessageTime || 0).getTime();
            const second = new Date(b.lastMessageTime || 0).getTime();
            return second - first;
          });
        setConversations(mappedRows);
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        setError(err?.response?.data?.message || 'Failed to load insights.');
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    return () => controller.abort();
  }, []);

  const totals = useMemo(() => {
    return conversations.reduce(
      (acc, item) => {
        acc.unread += item.unreadCount;
        acc.messages += item.totalMessages;
        return acc;
      },
      { unread: 0, messages: 0 }
    );
  }, [conversations]);

  const toggleOpen = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="dashboardPy dashboardSpaceY">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Conversations</h1>
          <p className="text-xs text-slate-400">
            {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
            {totals.unread > 0 && ` · ${totals.unread} unread`}
          </p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-white">
        {loading && (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
            <p className="text-sm text-slate-400">Loading conversations…</p>
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <Inbox className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-400">No conversations yet.</p>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && (
          <ul>
            {conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                isOpen={openId === conversation.id}
                onToggle={toggleOpen}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Insights;