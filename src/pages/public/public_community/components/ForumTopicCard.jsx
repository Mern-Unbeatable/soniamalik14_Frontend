import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ThumbsUp, Heart, MessageSquare, Send, MapPin, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET, POST } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { handleApiError } from '../../../../utils/errorHandler';

const ForumTopicCard = ({ topic, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [heartsCount, setHeartsCount] = useState(0);
  const [repliesCount, setRepliesCount] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [isReactingLike, setIsReactingLike] = useState(false);
  const [isReactingLove, setIsReactingLove] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [hasLongDescription, setHasLongDescription] = useState(false);
  const descriptionRef = useRef(null);

  const DESCRIPTION_LINE_LIMIT = 5;

  // Merging passed topic data with fallbacks to match the UI in your screenshots
  const {
    author = '',
    authorAvatar = '',
    title = '',
    titleColor = '',
    description = '',
    replies = 0,
    tags = [],
    likes = 0,
    hearts = 0,
    location = null, 
    date = null,
    time = null,
    comments = []
  } = topic || {};

  const postId = topic?.id || topic?.postId || topic?._id;

  useEffect(() => {
    setLikesCount(Number(likes || 0));
    setHeartsCount(Number(hearts || 0));
  }, [likes, hearts]);

  useEffect(() => {
    setRepliesCount(Number(replies || 0));
  }, [replies]);

  useEffect(() => {
    setCommentsList(Array.isArray(comments) ? comments : []);
  }, [comments]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsExpanded(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [description, postId]);

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (!el || !description) {
      setHasLongDescription(false);
      return;
    }

    const measureOverflow = () => {
      const styles = window.getComputedStyle(el);
      const lineHeight = parseFloat(styles.lineHeight);
      const limitHeight = Number.isFinite(lineHeight)
        ? lineHeight * DESCRIPTION_LINE_LIMIT
        : el.clientHeight;

      const clone = el.cloneNode(true);
      clone.removeAttribute('style');
      clone.style.cssText = [
        'position:absolute',
        'visibility:hidden',
        'pointer-events:none',
        'height:auto',
        'max-height:none',
        'overflow:visible',
        'display:block',
        '-webkit-line-clamp:unset',
        '-webkit-box-orient:unset',
        `width:${el.offsetWidth}px`,
      ].join(';');

      el.parentElement?.appendChild(clone);
      const fullHeight = clone.offsetHeight;
      clone.remove();

      setHasLongDescription(fullHeight > limitHeight + 1);
    };

    measureOverflow();
    window.addEventListener('resize', measureOverflow);
    return () => window.removeEventListener('resize', measureOverflow);
  }, [description, postId]);

  const handleToggleDescription = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDescriptionExpanded((prev) => !prev);
  };

  const fetchAndSetMyReaction = useCallback(async () => {
    if (!isLoggedIn || !postId) {
      setCurrentReaction(null);
      return null;
    }

    const response = await GET(ENDPOINT.COMMUNITY.MY_REACTION(postId));
    const payload = response?.data?.data || response?.data || {};
    const reactionType =
      payload?.reaction ||
      payload?.type ||
      payload?.reactionType ||
      payload?.reaction?.type ||
      null;
    const normalizedType = reactionType === 'LIKE' || reactionType === 'LOVE' ? reactionType : null;
    setCurrentReaction(normalizedType);
    return normalizedType;
  }, [isLoggedIn, postId]);

  useEffect(() => {
    let isCancelled = false;

    const fetchMyReaction = async () => {
      if (!isLoggedIn || !postId) {
        setCurrentReaction(null);
        return;
      }

      try {
        const normalizedType = await fetchAndSetMyReaction();
        if (!isCancelled) {
          setCurrentReaction(normalizedType);
        }
      } catch {
        if (!isCancelled) {
          setCurrentReaction(null);
        }
      }
    };

    fetchMyReaction();

    return () => {
      isCancelled = true;
    };
  }, [isLoggedIn, postId, fetchAndSetMyReaction]);

  const handleReaction = async (type) => {
    if (!isLoggedIn) {
      toast.error('Please log in to react.');
      navigate('/signin');
      return;
    }

    if (!postId) {
      toast.error('Post id is missing.');
      return;
    }

    const setLoading = type === 'LIKE' ? setIsReactingLike : setIsReactingLove;

    try {
      const previousReaction = currentReaction;
      setLoading(true);
      const response = await POST(ENDPOINT.COMMUNITY.POST_REACTION(postId), { type });
      const payload = response?.data?.data || response?.data || {};
      const breakdown = payload?.reactionBreakdown || {};
      const serverMessage = response?.data?.message || payload?.message || '';
      const serverTypeRaw =
        payload?.type ||
        payload?.reaction ||
        payload?.reactionType ||
        null;
      const serverType = serverTypeRaw === 'LIKE' || serverTypeRaw === 'LOVE' ? serverTypeRaw : null;
      const hasReactedFlag = Object.prototype.hasOwnProperty.call(payload, 'reacted');
      const removedByServer =
        payload?.reacted === false ||
        (!serverType && /removed/i.test(String(serverMessage)));

      const breakdownLikes = Number(breakdown?.LIKE);
      const breakdownHearts = Number(breakdown?.LOVE);

      if (Number.isFinite(breakdownLikes)) {
        setLikesCount(breakdownLikes);
      }
      if (Number.isFinite(breakdownHearts)) {
        setHeartsCount(breakdownHearts);
      }

      // Backend supports toggle: second click on same reaction can remove it.
      if (hasReactedFlag || removedByServer || serverType) {
        if (removedByServer) {
          setCurrentReaction(null);

          if (!Number.isFinite(breakdownLikes) && previousReaction === 'LIKE') {
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
          if (!Number.isFinite(breakdownHearts) && previousReaction === 'LOVE') {
            setHeartsCount((prev) => Math.max(0, prev - 1));
          }
        } else {
          const effectiveType = serverType || type;
          setCurrentReaction(effectiveType);

          if (!Number.isFinite(breakdownLikes) && !Number.isFinite(breakdownHearts)) {
            if (previousReaction && previousReaction !== effectiveType) {
              if (previousReaction === 'LIKE') {
                setLikesCount((prev) => Math.max(0, prev - 1));
              }
              if (previousReaction === 'LOVE') {
                setHeartsCount((prev) => Math.max(0, prev - 1));
              }
            }

            if (effectiveType === 'LIKE') {
              setLikesCount((prev) => prev + 1);
            }
            if (effectiveType === 'LOVE') {
              setHeartsCount((prev) => prev + 1);
            }
          } else {
            if (!Number.isFinite(breakdownLikes)) {
              if (previousReaction === 'LIKE' && effectiveType !== 'LIKE') {
                setLikesCount((prev) => Math.max(0, prev - 1));
              }
              if (previousReaction !== 'LIKE' && effectiveType === 'LIKE') {
                setLikesCount((prev) => prev + 1);
              }
            }

            if (!Number.isFinite(breakdownHearts)) {
              if (previousReaction === 'LOVE' && effectiveType !== 'LOVE') {
                setHeartsCount((prev) => Math.max(0, prev - 1));
              }
              if (previousReaction !== 'LOVE' && effectiveType === 'LOVE') {
                setHeartsCount((prev) => prev + 1);
              }
            }
          }
        }

        return;
      }

      if (type === 'LIKE' && Number.isFinite(Number(breakdown?.LIKE))) {
        setLikesCount(Number(breakdown.LIKE));
      } else if (type === 'LOVE' && Number.isFinite(Number(breakdown?.LOVE))) {
        setHeartsCount(Number(breakdown.LOVE));
      } else {
        if (previousReaction && previousReaction !== type) {
          if (previousReaction === 'LIKE') {
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
          if (previousReaction === 'LOVE') {
            setHeartsCount((prev) => Math.max(0, prev - 1));
          }
        }
        if (type === 'LIKE') {
          setLikesCount((prev) => prev + 1);
        }
        if (type === 'LOVE') {
          setHeartsCount((prev) => prev + 1);
        }
      }

      try {
        await fetchAndSetMyReaction();
      } catch {
        setCurrentReaction(type);
      }
    } catch (error) {
      toast.error(handleApiError(error) || 'Failed to react to post.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyOpen = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to comment.');
      navigate('/signin');
      return;
    }

    setIsExpanded(true);
  };

  const handleReplySubmit = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to comment.');
      navigate('/signin');
      return;
    }

    if (!postId) {
      toast.error('Post id is missing.');
      return;
    }

    const content = replyText.trim();
    if (!content) {
      toast.error('Please write a comment first.');
      return;
    }

    const submitComment = async () => {
      try {
        setIsSubmittingComment(true);
        const response = await POST(ENDPOINT.COMMUNITY.COMMENTS(postId), { content });
        const payload = response?.data?.data || response?.data || {};
        const createdComment = payload?.comment || payload;
        const createdAuthor =
          createdComment?.author?.displayName ||
          createdComment?.author?.name ||
          createdComment?.authorName ||
          'You';
        const createdText = createdComment?.content || createdComment?.text || content;

        setCommentsList((prev) => [...prev, { author: createdAuthor, text: createdText }]);

        const serverCommentsCount = Number(
          payload?.totalComments ?? payload?.commentsCount ?? payload?._count?.comments
        );
        if (Number.isFinite(serverCommentsCount)) {
          setRepliesCount(serverCommentsCount);
        } else {
          setRepliesCount((prev) => prev + 1);
        }

        setReplyText('');
        toast.success(response?.data?.message || 'Comment added.');
      } catch (error) {
        toast.error(handleApiError(error) || 'Failed to add comment.');
      } finally {
        setIsSubmittingComment(false);
      }
    };

    submitComment();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 transition-all">
      {/* Header: Avatar & Name */}
      <div className="flex items-center gap-2.5 mb-4">
        {authorAvatar ? (
          <img
            src={authorAvatar} 
            alt={author}
            className="w-8 h-8 rounded-full object-cover border border-gray-100"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <User className="w-4.5 h-4.5 text-gray-500" />
          </div>
        )}
        <span className="text-base text-gray-700 font-medium">
          {author}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="bg-[#EBEBEB] text-[#333333] px-3 py-1 text-sm rounded font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Conditional Event Info (Shows if location exists, matching Image 2 layout) */}
      {location && (
        <div className="flex flex-wrap items-center justify-between text-[#4A5568] text-sm mb-4 font-medium">
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" /> {location}</div>
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-500" /> {date}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> {time}</div>
        </div>
      )}

      {/* Topic Title */}
      <h3 className="text-[18px] md:text-xl font-bold mb-2 leading-snug" style={{ color: titleColor }}>
        {title}
      </h3>

      {/* Description (Only render if it exists) */}
      {description && (
        <div className="mb-5">
          <p
            ref={descriptionRef}
            className="text-[#4A5568] text-sm md:text-base leading-relaxed "
            style={
              isDescriptionExpanded
                ? undefined
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: DESCRIPTION_LINE_LIMIT,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
            }
          >
            {description}
          </p>
          {hasLongDescription && (
            <button
              type="button"
              onClick={handleToggleDescription}
              className="mt-2 text-sm font-semibold text-[#147A73] hover:underline"
            >
              {isDescriptionExpanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      )}

      {/* Conditional Checkboxes (For Event posts like Image 2) */}
      {location && isExpanded && (
        <div className="flex items-center gap-5 mb-5 text-[13px] text-gray-600 font-medium border-b border-gray-100 pb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded-sm border-gray-300 text-[#147B6B] focus:ring-[#147B6B]" /> 
            Help found
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded-sm border-gray-300 text-[#147B6B] focus:ring-[#147B6B]" /> 
            Still looking
          </label>
        </div>
      )}

      {/* Footer / Interaction Bar */}
      {!isExpanded && (
        <div className="border-t border-gray-100 pt-4 mt-2 flex items-center gap-4 text-[13px] text-gray-500 font-medium">
          <button
            onClick={() => handleReaction('LIKE')}
            disabled={isReactingLike}
            className={`flex items-center gap-1.5 text-base transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              currentReaction === 'LIKE' ? 'text-[#147B6B]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ThumbsUp className="w-4 h-4" fill={currentReaction === 'LIKE' ? 'currentColor' : 'none'} /> {likesCount}
          </button>
          
          <button
            onClick={() => handleReaction('LOVE')}
            disabled={isReactingLove}
            className={`flex items-center gap-1.5 text-base transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              currentReaction === 'LOVE' ? 'text-[#E11D48]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" fill={currentReaction === 'LOVE' ? 'currentColor' : 'none'} /> {heartsCount}
          </button>
          
          <span className="text-gray-300">|</span>
          
          <button 
            onClick={handleReplyOpen}
            className="flex items-center gap-1.5 text-base hover:text-gray-800 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" /> {repliesCount} Reply
          </button>
        </div>
      )}

      {/* Expanded Reply Section */}
      {isExpanded && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-base font-bold text-[#1A1D1F] mb-4">Reply</h4>
          
          {/* Comments List */}
          <div className="space-y-3 mb-4">
            {commentsList.map((comment, idx) => (
              <div key={idx} className="bg-[#F6F6F6] p-4 rounded-lg">
                <div className="text-base font-medium text-gray-800 mb-1.5">{comment.author}</div>
                <p className="text-base text-[#4A5568] leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>

          {/* Reply Input Box */}
          <div className="flex items-center gap-3 bg-[#F0F5F4] p-2 rounded-lg mt-2">
            <input 
              type="text" 
              placeholder="Write your reply" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReplySubmit();
                }
              }}
              className="w-full bg-transparent border-none focus:ring-0 text-[14px] px-3 placeholder-gray-500 outline-none text-[#1A1D1F]"
            />
            <button 
              onClick={handleReplySubmit}
              disabled={isSubmittingComment}
              className="bg-[#147B6B] p-2.5 rounded-lg text-white shrink-0 hover:bg-[#0D655D] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="-ml-0.5 mt-px w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumTopicCard;