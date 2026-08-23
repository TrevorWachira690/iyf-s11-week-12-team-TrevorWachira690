import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, timeAgo } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function Posts() {
  const { isLoggedIn, token } = useAuth();

  const [posts, setPosts] = useState(null); // null = loading
  const [loadError, setLoadError] = useState('');

  const loadPosts = async () => {
    try {
      const data = await apiFetch('/posts', { token: isLoggedIn ? token : undefined });
      setPosts(data);
    } catch (err) {
      setLoadError(err.message);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async (postId) => {
    if (!isLoggedIn) return;

    // Optimistic update so the tap feels instant...
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: (p.likeCount ?? 0) + (p.likedByMe ? -1 : 1) }
          : p
      )
    );

    try {
      // ...then reconcile with whatever the server actually recorded, so a
      // stale local guess can never get "stuck" out of sync with the DB.
      const result = await apiFetch(`/posts/${postId}/like`, { method: 'POST', token });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likeCount: result.likeCount, likedByMe: result.likedByMe } : p
        )
      );
    } catch (err) {
      loadPosts(); // roll back by re-syncing with the server
    }
  };

  return (
    <>
      <div className="top-actions">
        <h1 className="page-title">Recent posts</h1>
        {isLoggedIn && (
          <Link to="/posts/new" className="btn">
            + New post
          </Link>
        )}
      </div>

      {loadError && <div className="error show">{loadError}</div>}

      {posts === null && !loadError && <p className="hint">Loading posts…</p>}

      {posts && posts.length === 0 && (
        <div className="empty-state">
          No posts yet.{' '}
          {isLoggedIn ? (
            <Link to="/posts/new">Be the first to share something!</Link>
          ) : (
            'Log in to be the first to share something!'
          )}
        </div>
      )}

      {posts &&
        posts.map((post) => (
          <article className="feed-card" key={post._id}>
            <div className="feed-card-header">
              <Link to={`/users/${post.author?._id}`} className="feed-card-author">
                <Avatar src={post.author?.avatar} name={post.author?.name} size={34} />
                <span className="author-name">{post.author?.name || 'Unknown'}</span>
              </Link>
              <span className="hint">{timeAgo(post.createdAt)}</span>
            </div>

            {post.image && (
              <Link to={`/posts/${post._id}`}>
                <img src={post.image} alt="" className="feed-card-image" />
              </Link>
            )}

            <div className="feed-card-actions">
              <button
                className={`like-btn ${post.likedByMe ? 'liked' : ''}`}
                onClick={() => handleLike(post._id)}
                disabled={!isLoggedIn}
                title={isLoggedIn ? '' : 'Log in to like posts'}
              >
                {post.likedByMe ? '♥' : '♡'} {post.likeCount ?? 0}
              </button>
            </div>

            {post.content && (
              <p className="feed-card-caption">
                <Link to={`/users/${post.author?._id}`} className="author-name">
                  {post.author?.name || 'Unknown'}
                </Link>{' '}
                <Link to={`/posts/${post._id}`} className="caption-text">
                  {post.content}
                </Link>
              </p>
            )}
          </article>
        ))}
    </>
  );
}

