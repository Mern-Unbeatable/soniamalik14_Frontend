import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../features/auth/authSlice';
import CategorySidebar from './components/CategorySidebar';
import ForumTopicCard from './components/ForumTopicCard';
import StartADiscussion from './components/StartADiscussion';
import ShareAnExperienceModal from './components/ShareAnExperienceModal';
import AskAQuestionModal from './components/AskAQuestionModal';
import AddPostModal from './components/AddPostModal';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/ui/PageHeader';
import EmptyState from '../../../components/ui/EmptyState';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { GET, POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { handleApiError } from '../../../utils/errorHandler';

const COMMUNITY_CATEGORY_MAP = {
  'All posts': 'STORIES',
  'Stories & Experiences': 'STORIES',
  'Questions & Advice': 'QUESTIONS',
  'Match & event support': 'SUPPORT',
};

const CommunityView = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All posts');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSport, setActiveSport] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsPagination, setPostsPagination] = useState({ totalPages: 1, page: 1, total: 0, limit: 6 });
  const canCreatePost = isAuthenticated && [ROLES.USER, ROLES.ADMIN].includes(user?.role);

  const sports = [
    'All',
    'Football',
    'Netball',
    'Padel',
    'Squash',
    'Cricket',
    'Multi-Sport',
    'Not sport-specific',
  ];
  const itemsPerPage = 6;
  const subheadingTextClass = 'text-base md:text-lg text-[#585858] leading-relaxed';

  const buildTags = (formData = {}) => {
    const baseTags = [
      ...(Array.isArray(formData.topics) ? formData.topics : []),
      ...(Array.isArray(formData.helps) ? formData.helps : []),
    ];

    if (formData.location?.trim()) {
      baseTags.push(formData.location.trim());
    }

    if (formData.date) {
      baseTags.push(formData.date);
    }

    if (formData.time) {
      baseTags.push(formData.time);
    }

    return [...new Set(baseTags.map((tag) => String(tag).trim()).filter(Boolean))];
  };

  const handleShareExperience = async (formData) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return false;
    }

    if (![ROLES.USER, ROLES.ADMIN].includes(user?.role)) {
      toast.error('Only users and admins can create community posts.');
      return false;
    }

    const category = COMMUNITY_CATEGORY_MAP[activeCategory] || 'STORIES';
    const payload = {
      title: formData?.threadTitle?.trim(),
      description: formData?.description?.trim(),
      category,
      sport: formData?.sport,
      tags: buildTags(formData),
    };

    try {
      setIsPosting(true);
      await POST(ENDPOINT.COMMUNITY.CREATE_POST, payload);
      toast.success('Post created successfully.');
      setCurrentPage(1);
      await fetchPosts();
      return true;
    } catch (error) {
      toast.error(handleApiError(error) || 'Failed to create post.');
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  const handleOpenModal = () => {
    if (isAuthenticated) {
      if (![ROLES.USER, ROLES.ADMIN].includes(user?.role)) {
        toast.error('Only users and admins can create community posts.');
        return;
      }

      setShowModal(true);
    } else {
      navigate('/signin');
    }
  };

  const mapPostToTopicCard = (post) => {
    const likeCount = Number(post?.reactionBreakdown?.LIKE ?? post?.likesCount ?? post?._count?.likes ?? 0);
    const loveCount = Number(post?.reactionBreakdown?.LOVE ?? 0);
    const totalComments = Number(post?.totalComments ?? post?.commentsCount ?? post?._count?.comments ?? 0);
    const authorName = post?.author?.displayName || post?.author?.name || post?.author?.email || 'Unknown User';
    const baseTags = [post?.sport, ...(Array.isArray(post?.tags) ? post.tags : [])]
      .map((tag) => String(tag || '').trim())
      .filter(Boolean);

    return {
      id: post?.id,
      author: authorName,
      authorAvatar: post?.author?.avatar || null,
      title: post?.title || '',
      titleColor: '#0B544E',
      description: post?.description || '',
      tags: [...new Set(baseTags)],
      likes: likeCount,
      hearts: loveCount,
      replies: totalComments,
      location: post?.location || null,
      date: post?.date || null,
      time: post?.time || null,
      comments: Array.isArray(post?.comments)
        ? post.comments.map((comment) => ({
            author: comment?.author?.displayName || comment?.author?.name || 'Unknown User',
            text: comment?.content || '',
          }))
        : [],
    };
  };

  const fetchPosts = useCallback(async () => {
    const categoryParam = activeCategory === 'All posts' ? undefined : COMMUNITY_CATEGORY_MAP[activeCategory];
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      ...(categoryParam ? { category: categoryParam } : {}),
      ...(activeSport !== 'All' ? { sport: activeSport } : {}),
      ...(appliedSearchQuery.trim() ? { search: appliedSearchQuery.trim() } : {}),
    };

    try {
      setIsLoadingPosts(true);
      const response = await GET(ENDPOINT.COMMUNITY.LIST_POSTS, params);
      const payload = response?.data?.data || {};
      const fetchedPosts = Array.isArray(payload?.posts) ? payload.posts : [];
      const pagination = payload?.pagination || {};

      setPosts(fetchedPosts.map(mapPostToTopicCard));
      setPostsPagination({
        totalPages: Number(pagination?.totalPages || 1),
        page: Number(pagination?.page || currentPage),
        total: Number(pagination?.total || fetchedPosts.length || 0),
        limit: Number(pagination?.limit || itemsPerPage),
      });
    } catch (error) {
      setPosts([]);
      setPostsPagination({ totalPages: 1, page: 1, total: 0, limit: itemsPerPage });
      toast.error(handleApiError(error) || 'Failed to load community posts.');
    } finally {
      setIsLoadingPosts(false);
    }
  }, [activeCategory, activeSport, appliedSearchQuery, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSport]);

  const headerConfig = {
    'All posts': {
      title: 'ESSA Community',
      buttonText: 'Ask Or Share',
      titleClass: 'text-[32px] font-bold text-[#0B544E]',
    },
    'Stories & Experiences': {
      title: 'A space to share moments, reflections and stories from your time in sport.',
      buttonText: 'Share an Experience',
      titleClass: `${subheadingTextClass} max-w-2xl`,
    },
    'Questions & Advice': {
      title: "Ask for advice, reassurance, or perspectives from others who've been there.",
      buttonText: 'Question',
      titleClass: `${subheadingTextClass} max-w-2xl`,
    },
    'Match & event support': {
      title:
        'Need a last-minute sub, referee, or extra help for a match or event? Post here for short-term support from the community.',
      buttonText: 'Add Post',
      titleClass: `${subheadingTextClass} max-w-3xl`,
    },
  };

  // Fallback to the community overview if category doesn't match perfectly
  const currentHeader = headerConfig[activeCategory] || headerConfig['All posts'];

  const totalPages = postsPagination.totalPages || 1;

  const handleSearchSubmit = () => {
    setAppliedSearchQuery(searchQuery.trim());
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 lg:py-10">
      <Container>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 lg:gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-37 hidden lg:block">
              <CategorySidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* Mobile Title - Above Dropdown (Mobile Only) */}
            <div className="mb-4 lg:hidden">
              <PageHeader
                title="ESSA Community"
                description={
                  activeCategory === 'All posts'
                    ? 'Browse all conversations across the community - from questions to shared experiences.'
                    : activeCategory === 'Stories & Experiences'
                    ? 'A space to share moments, reflections and stories from your time in sport.'
                    : activeCategory === 'Questions & Advice'
                    ? 
                      "Ask for advice, reassurance, or perspectives from others who've been there."
                    : activeCategory === 'Match & event support'
                    ? 'Need a last-minute sub, referee, or extra help for a match or event? Post here for short-term support from the community.'
                    : ''
                }
              />
            </div>

            {/* Mobile Category Dropdown */}
            <div className="mb-6 lg:hidden">
              <select
                value={activeCategory}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-[#1A1D1F] focus:border-transparent focus:ring-2 focus:ring-[#147B6B] focus:outline-none"
              >
                <option value="All posts">All posts</option>
                <option value="Stories & Experiences">Stories & Experiences</option>
                <option value="Questions & Advice">Questions & Advice</option>
                <option value="Match & event support">Match & event support</option>
              </select>
            </div>

            {/* Mobile Button (Mobile Only) */}
            <div className="mb-6 lg:hidden">
              <Button
                variant="primary"
                disabled={isAuthenticated && !canCreatePost}
                className="w-full rounded-md bg-[#147B6B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0D655D] text-xs"
                onClick={handleOpenModal}
              >
                {!isAuthenticated ? 'Log in To Post' : canCreatePost ? 'Ask Or Share' : 'Community discussions are for individual members only'}
              </Button>
            </div>

            {/* Dynamic Header Section */}
            <div className="mb-6 hidden flex-col items-start justify-between gap-4 sm:flex-row lg:flex">
              <div>
                {/* Always show the ESSA Community title */}
                <div className="text-[32px] font-bold text-[#0B544E]">ESSA Community</div>
                {/* Show dynamic subheading/description for each category */}
                {activeCategory === 'All posts' && (
                  <p className={`${subheadingTextClass} mt-1 md:mt-2.5 max-w-3xl`}>
                    Browse all conversations across the community - from questions to shared experiences.
                  </p>
                )}
                {activeCategory === 'Stories & Experiences' && (
                  <p className={`${subheadingTextClass} mt-1 md:mt-2.5 max-w-2xl`}>
                    A space to share moments, reflections and stories from your time in sport.
                  </p>
                )}
                {activeCategory === 'Questions & Advice' && (
                  <p className={`${subheadingTextClass} mt-1 md:mt-2.5 max-w-2xl`}>
                    Ask for advice, reassurance, or perspectives from others who've been there.
                  </p>
                )}
                {activeCategory === 'Match & event support' && (
                  <p className={`${subheadingTextClass} mt-1 md:mt-2.5 max-w-3xl`}>
                    Need a last-minute sub, referee, or extra help for a match or event? Post here for short-term support from the community.
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                disabled={isAuthenticated && !canCreatePost}
                className="w-full shrink-0 rounded-md bg-[#147B6B] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#0D655D] sm:w-auto"
                onClick={handleOpenModal}
              >
                {!isAuthenticated ? 'Log in To Post' : canCreatePost ? currentHeader.buttonText : 'Community discussions are for individual members only'}
              </Button>
            </div>

            {/* Filter & Search Section */}
            {isAuthenticated && (
              <div className="mb-6">
                <div className="mb-4 flex flex-wrap gap-2 md:gap-4">
                  {sports.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setActiveSport(sport)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors md:text-base ${
                        activeSport === sport
                          ? 'bg-[#147B6B] text-white'
                          : 'bg-[#91C0BC] text-[#242424] hover:bg-[#7db0ac]'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder=" Search topics, questions or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 pl-4 text-[15px] outline-none focus:border-transparent focus:ring-2 focus:ring-[#147B6B]"
                  />
                  <svg
                    className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="mb-8 space-y-2 lg:space-y-4">
              {isLoadingPosts ? (
                <LoadingSpinner label="Loading community posts..." />
              ) : posts.length ? (
                posts.map((topic) => (
                  <ForumTopicCard key={topic.id} topic={topic} isLoggedIn={isAuthenticated} />
                ))
              ) : (
                <EmptyState
                  title="No posts found"
                  subtitle="Try changing category, sport, or search term."
                />
              )}
            </div>

            {totalPages > 1 && (
              <Pagination page={currentPage} total={totalPages} onChange={setCurrentPage} />
            )}
          </div>
        </div>
      </Container>

      <StartADiscussion
        isOpen={showModal && activeCategory === 'All posts'}
        onClose={() => setShowModal(false)}
        onSubmit={handleShareExperience}
        isSubmitting={isPosting}
      />

      <ShareAnExperienceModal
        isOpen={showModal && activeCategory === 'Stories & Experiences'}
        onClose={() => setShowModal(false)}
        onSubmit={handleShareExperience}
        isSubmitting={isPosting}
      />

      <AskAQuestionModal
        isOpen={showModal && activeCategory === 'Questions & Advice'}
        onClose={() => setShowModal(false)}
        onSubmit={handleShareExperience}
        isSubmitting={isPosting}
      />

      <AddPostModal
        isOpen={showModal && activeCategory === 'Match & event support'}
        onClose={() => setShowModal(false)}
        onSubmit={handleShareExperience}
        isSubmitting={isPosting}
      />
    </div>
  );
};

export default CommunityView;
