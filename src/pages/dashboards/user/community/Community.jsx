import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageSquare, MessagesSquare, Reply } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/ui/Pagination';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import PostActivityCard from './components/PostActivityCard';
import InteractionItem from './components/InteractionItem';

const POSTS_PER_PAGE = 6;
const INTERACTIONS_PER_PAGE = 10;

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [interactions, setInteractions] = useState([]);
  const [interactionsPage, setInteractionsPage] = useState(1);
  const [interactionsTotalPages, setInteractionsTotalPages] = useState(1);
  const [interactionsSummary, setInteractionsSummary] = useState(null);
  const [loadingInteractions, setLoadingInteractions] = useState(true);

  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const res = await GET(ENDPOINT.COMMUNITY.MY_POSTS_ACTIVITY, {
        page: postsPage,
        limit: POSTS_PER_PAGE,
      });
      const payload = res?.data?.data || {};
      const fetchedPosts = Array.isArray(payload?.posts) ? payload.posts : [];
      const pagination = payload?.pagination || {};

      setPosts(fetchedPosts);
      setPostsTotalPages(Number(pagination?.totalPages) > 0 ? Number(pagination.totalPages) : 1);
    } catch (error) {
      console.error('Failed to fetch post activity:', error);
      setPosts([]);
      setPostsTotalPages(1);
      toast.error('Failed to load your posts');
    } finally {
      setLoadingPosts(false);
    }
  }, [postsPage]);

  const fetchInteractions = useCallback(async () => {
    try {
      setLoadingInteractions(true);
      const res = await GET(ENDPOINT.COMMUNITY.MY_INTERACTIONS, {
        page: interactionsPage,
        limit: INTERACTIONS_PER_PAGE,
      });
      const payload = res?.data?.data || {};
      const fetchedInteractions = Array.isArray(payload?.interactions)
        ? payload.interactions
        : [];
      const pagination = payload?.pagination || {};

      setInteractions(fetchedInteractions);
      setInteractionsSummary(payload?.summary || null);
      setInteractionsTotalPages(
        Number(pagination?.totalPages) > 0 ? Number(pagination.totalPages) : 1
      );
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
      setInteractions([]);
      setInteractionsSummary(null);
      setInteractionsTotalPages(1);
      toast.error('Failed to load interactions');
    } finally {
      setLoadingInteractions(false);
    }
  }, [interactionsPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const interactionsByPostId = useMemo(() => {
    const map = {};
    interactions.forEach((interaction) => {
      const postId = interaction?.post?.id;
      if (!postId) return;
      if (!map[postId]) map[postId] = [];
      map[postId].push(interaction);
    });
    return map;
  }, [interactions]);

  const getCommentsForPost = (post) => {
    if (Array.isArray(post?.comments) && post.comments.length > 0) {
      return post.comments;
    }

    const fromInteractions = interactionsByPostId[post?.id] || [];
    return fromInteractions.map((item) => ({
      id: item.id,
      content: item.content,
      createdAt: item.createdAt,
      author: item.author,
    }));
  };

  const handleTogglePost = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const handlePostsPageChange = (page) => {
    setExpandedPostId(null);
    setPostsPage(page);
  };

  const handleInteractionsPageChange = (page) => {
    setInteractionsPage(page);
  };

  const summaryCards = [
    {
      label: 'Total Comments',
      value: interactionsSummary?.totalComments ?? 0,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Total Replies',
      value: interactionsSummary?.totalReplies ?? 0,
      icon: Reply,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Total Interactions',
      value: interactionsSummary?.totalInteractions ?? 0,
      icon: MessagesSquare,
      color: 'text-[#147A73] bg-[#147A73]/10',
    },
  ];

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Community</h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Track activity on your posts and see who is engaging with your content.
        </p>
      </div>

      {/* <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div> */}

      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === 'posts'
              ? 'bg-[#147A73] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          My Posts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('interactions')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === 'interactions'
              ? 'bg-[#147A73] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Interactions
        </button>
      </div>

      {activeTab === 'posts' ? (
        <>
          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#147A73] border-t-transparent" />
              <p className="text-base text-gray-500">Loading your posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostActivityCard
                    key={post.id}
                    post={post}
                    isExpanded={expandedPostId === post.id}
                    onToggle={() => handleTogglePost(post.id)}
                    comments={getCommentsForPost(post)}
                  />
                ))}
              </div>

              {postsTotalPages > 1 && (
                <Pagination page={postsPage} total={postsTotalPages} onChange={handlePostsPageChange} />
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <p className="text-lg text-gray-500">You have not created any community posts yet.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {loadingInteractions ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#147A73] border-t-transparent" />
              <p className="text-base text-gray-500">Loading interactions...</p>
            </div>
          ) : interactions.length > 0 ? (
            <>
              <div className="space-y-3">
                {interactions.map((interaction) => (
                  <InteractionItem key={interaction.id} interaction={interaction} />
                ))}
              </div>

              {interactionsTotalPages > 1 && (
                <Pagination
                  page={interactionsPage}
                  total={interactionsTotalPages}
                  onChange={handleInteractionsPageChange}
                />
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <p className="text-lg text-gray-500">No interactions on your posts yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Community;
