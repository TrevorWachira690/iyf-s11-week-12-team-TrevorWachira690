import React, { useState } from 'react';
import { likePost, dislikePost, removeReaction } from '../services/api';
import { useAuth } from '../context/AuthContext'; // adjust if the hook name differs

/**
 * Like/dislike controls for a single post.
 * Expects the parent (PostDetail.jsx) to pass the post's current
 * reaction data, since PostDetail already loaded the post.
 *
 * Props:
 *   postId       - string, required
 *   likes        - number, initial like count
 *   dislikes     - number, initial dislike count
 *   userReaction - 'like' | 'dislike' | null, current user's reaction
 */
export default function ReactionControls({ postId, likes, dislikes, userReaction }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ likes, dislikes, userReaction });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const runAction = async (action) => {
    if (!user) {
      setError('Log in to react to posts.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      setCounts({
        likes: result.likes,
        dislikes: result.dislikes,
        userReaction: result.userReaction,
      });
    } catch (err) {
      setError(err.message || 'Unable to update reaction.');
    } finally {
      setBusy(false);
    }
  };

  const handleLike = () => {
    if (counts.userReaction === 'like') {
      runAction(() => removeReaction(postId));
    } else {
      runAction(() => likePost(postId));
    }
  };

  const handleDislike = () => {
    if (counts.userReaction === 'dislike') {
      runAction(() => removeReaction(postId));
    } else {
      runAction(() => dislikePost(postId));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={busy}
          aria-pressed={counts.userReaction === 'like'}
          className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            counts.userReaction === 'like'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👍 {counts.likes}
        </button>
        <button
          type="button"
          onClick={handleDislike}
          disabled={busy}
          aria-pressed={counts.userReaction === 'dislike'}
          className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
            counts.userReaction === 'dislike'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👎 {counts.dislikes}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}