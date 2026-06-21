import React from 'react';
import { MessageSquare } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getAuthorLabel = (author) =>
  author?.displayName || author?.name || 'Community member';

const InteractionItem = ({ interaction }) => {
  const isComment = interaction?.type === 'COMMENT';

  return (
    <div className="flex gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#147A73]/10">
        <MessageSquare className="h-5 w-5 text-[#147A73]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {getAuthorLabel(interaction?.author)}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{formatDate(interaction?.createdAt)}</span>
          {isComment && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              Comment
            </span>
          )}
        </div>

        {interaction?.post?.title && (
          <p className="mb-2 text-xs font-medium text-[#147A73]">
            On: {interaction.post.title}
          </p>
        )}

        <p className="text-sm leading-relaxed text-gray-700">{interaction?.content}</p>

        {Number(interaction?.replyCount) > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {interaction.replyCount} {interaction.replyCount === 1 ? 'reply' : 'replies'}
          </p>
        )}
      </div>
    </div>
  );
};

export default InteractionItem;
