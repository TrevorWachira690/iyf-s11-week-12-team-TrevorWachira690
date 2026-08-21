import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SEO from '../components/SEO.jsx';

const PLACEHOLDER_IMAGE = 'https://placehold.net/600x400.png';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);

  useEffect(() => {
    async function fetchListingAndComments() {
      try {
        const [listingData, commentsData] = await Promise.all([
          api.getPost(id),
          api.getComments(id),
        ]);
        const post = listingData.post || listingData.listing;
        setListing(post);
        setComments(commentsData.comments || []);
        
        if (user && post) {
          setUserHasLiked(post.likedBy?.includes(user._id) || false);
          setUserHasDisliked(post.dislikedBy?.includes(user._id) || false);
        }

        const recentlyViewedListings = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        );
        const updatedList = [id, ...recentlyViewedListings.filter((listingId) => listingId !== id)].slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedList));
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListingAndComments();
  }, [id, user]);

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await api.createComment({ content: commentText, postId: id });
      setComments((previousComments) => [...previousComments, response.comment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLikeToggle() {
    if (!user) return;
    try {
      const response = await api.toggleLike(id);
      setUserHasLiked(response.post.likedBy?.includes(user._id) || false);
      setUserHasDisliked(response.post.dislikedBy?.includes(user._id) || false);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }

  async function handleDislikeToggle() {
    if (!user) return;
    try {
      const response = await api.toggleDislike(id);
      setUserHasLiked(response.post.likedBy?.includes(user._id) || false);
      setUserHasDisliked(response.post.dislikedBy?.includes(user._id) || false);
    } catch (error) {
      console.error('Failed to toggle dislike:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Loading listing...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <EmptyState title="Listing not found" message="The listing you're looking for doesn't exist." />
      </div>
    );
  }

  const hasImageGallery = listing.images && listing.images.length > 0;
  const imageList = Array.isArray(listing.images) ? listing.images.filter(Boolean) : [];
  const allImages = hasImageGallery ? imageList : [listing.image].filter(Boolean);

  const whatsappLink = `https://wa.me/${listing.author?.whatsappNumber || ''}?text=${encodeURIComponent(
    `Hi, I saw your listing "${listing.title}" on TBM-DeepIn and would like to enquire more.`
  )}`;

  return (
    <>
      <SEO 
        title={`${listing.title} — TBM-DeepIn`} 
        description={`${listing.title} - ${listing.category}`} 
      />
      
      <div className="max-w-2xl mx-auto p-4">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 text-sm mb-4 inline-block">
          ← Back to listings
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((imageSrc, index) => (
                imageSrc && (
                  <img
                    key={index}
                    src={imageSrc}
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="w-64 h-48 object-cover rounded-lg flex-shrink-0"
                    onError={(event) => {
                      event.target.src = PLACEHOLDER_IMAGE;
                      event.target.onerror = null;
                    }}
                  />
                )
              ))}
            </div>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <span className="text-sm text-gray-500">
              {new Date(listing.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">{listing.description}</p>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${listing.price?.toLocaleString()}
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              {listing.category}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {listing.author?.avatar && (
              <img
                src={listing.author.avatar}
                alt={listing.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span>
              Posted by <strong>{listing.author?.name || 'Unknown'}</strong>
            </span>
            {user && (
              <>
                <button
                  onClick={handleLikeToggle}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    userHasLiked 
                      ? 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  👍 {listing.likeCount || 0}
                </button>
                <button
                  onClick={handleDislikeToggle}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    userHasDisliked 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  👎 {listing.dislikeCount || 0}
                </button>
              </>
            )}
          </div>
          
          {listing.author?.whatsappNumber && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Contact via WhatsApp
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.952 14.952a2 2 0 01-2.952 2.952L8.1 15.952a2 2 0 01-1.05-1.05l2.952-2.952zM19.5 6.5a2 2 0 10-4 0 2 2 0 004 0z" /></svg>
            </a>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
            <span className="text-sm text-gray-500">
              👍 {listing.likeCount || 0} | 👎 {listing.dislikeCount || 0}
            </span>
          </div>
          
          {user && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
              <input
                type="text"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          )}
          
          {!user && (
            <p className="text-gray-400 text-sm mb-4">
              <Link to="/login" className="text-indigo-600">Log in</Link> to leave a comment.
            </p>
          )}
          
          {comments.length === 0 ? (
            <EmptyState title="No comments yet" message="Be the first to comment!" />
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    {comment.author?.avatar && (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium text-sm">{comment.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}