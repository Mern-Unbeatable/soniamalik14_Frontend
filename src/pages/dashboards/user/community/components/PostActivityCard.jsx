import React from 'react';
import { ChevronDown, ChevronUp, Heart, MessageSquare, Tag } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getAuthorLabel = (author) =>
  author?.displayName || author?.name || 'Community member';

const PostActivityCard = ({ post, isExpanded, onToggle, comments = [] }) => {
  const commentsCount = post?.commentsCount ?? post?._count?.comments ?? comments.length ?? 0;
  const likesCount = post?.likesCount ?? post?._count?.likes ?? 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 md:p-6 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {post?.hasNewActivity && (
                <span className="rounded-full bg-[#147A73]/10 px-2.5 py-0.5 text-xs font-semibold text-[#147A73]">
                  {post.activityCount} new
                </span>
              )}
              {post?.category && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {post.category.replace(/_/g, ' ')}
                </span>
              )}
              {post?.sport && (
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                  {post.sport}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 md:text-xl">{post?.title || 'Untitled post'}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 md:text-base">
              {post?.description || 'No description provided.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </span>
              <span>{formatDate(post?.createdAt)}</span>
            </div>

            {Array.isArray(post?.tags) && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 pt-1 text-gray-400">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 md:px-6 md:py-5">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Comments on this post
          </h4>

          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#147A73] text-sm font-semibold text-white">
                      {getAuthorLabel(comment.author).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {getAuthorLabel(comment.author)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">No comments on this post yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostActivityCard;
