import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch, timeAgo } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token, user } = useAuth();

  const [post, setPost] = useState(null);
  const [postError, setPostError] = useState('');

  const [comments, setComments] = useState(null);
  const [commentsError, setCommentsError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [commentFormError, setCommentFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = async () => {
    try {
      const data = await apiFetch(`/posts/${id}`, { token: isLoggedIn ? token : undefined });
      setPost(data);
    } catch (err) {
      setPostError(err.message);
    }
  };

  const loadComments = async () => {
    try {
      const data = await apiFetch(`/posts/${id}/comments`);
      setComments(data);
    } catch (err) {
      setCommentsError(err.message);
    }
  };

  useEffect(() => {
    loadPost();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await apiFetch(`/posts/${id}`, { method: 'DELETE', token });
      navigate('/posts');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await apiFetch(`/posts/${id}/comments/${commentId}`, { method: 'DELETE', token });
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentFormError('');
    setSubmitting(true);
    try {
      await apiFetch(`/posts/${id}/comments`, {
        method: 'POST',
        token,
        body: { text: commentText },
      });
      setCommentText('');
      await loadComments();
    } catch (err) {
      setCommentFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isPostOwner = post && user && post.author?._id === user.id;

  const handleLike = async () => {
    if (!isLoggedIn || !post) return;
    setPost((p) => ({
      ...p,
      likedByMe: !p.likedByMe,
      likeCount: (p.likeCount ?? 0) + (p.likedByMe ? -1 : 1),
    }));
    try {
      const result = await apiFetch(`/posts/${id}/like`, { method: 'POST', token });
      setPost((p) => ({ ...p, likeCount: result.likeCount, likedByMe: result.likedByMe }));
    } catch (err) {
      loadPost();
    }
  };

  return (
    <>
      <p>
        <Link to="/posts">&larr; Back to all posts</Link>
      </p>

      <article className="card">
        {postError && <div className="error show">{postError}</div>}
        {!post && !postError && <p className="hint">Loading post…</p>}
        {post && (
          <>
            <div className="post-item-author">
              <Avatar src={post.author?.avatar} name={post.author?.name} size={28} />
              <Link to={`/users/${post.author?._id}`} className="author-name">
                {post.author?.name || 'Unknown'}
              </Link>
              <span className="hint">· {timeAgo(post.createdAt)}</span>
            </div>
            {post.image && <img src={post.image} alt="" className="post-full-image" />}
            {post.content && <p className="post-full-content">{post.content}</p>}
            <div className="row-actions">
              <button
                className={`like-btn ${post.likedByMe ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={!isLoggedIn}
                title={isLoggedIn ? '' : 'Log in to like posts'}
              >
                {post.likedByMe ? '♥' : '♡'} {post.likeCount ?? 0}
              </button>
              {isPostOwner && (
                <button className="link-btn" onClick={handleDeletePost}>
                  Delete post
                </button>
              )}
            </div>
          </>
        )}
      </article>

      {isLoggedIn && (
        <section className="card">
          <h2>Add a comment</h2>
          {commentFormError && <div className="error show">{commentFormError}</div>}
          <form onSubmit={handleCommentSubmit}>
            <div>
              <textarea
                required
                maxLength={1000}
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Posting…' : 'Comment'}
            </button>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Comments</h2>
        {commentsError && <div className="error show">{commentsError}</div>}
        {comments === null && !commentsError && <p className="hint">Loading comments…</p>}
        {comments && comments.length === 0 && (
          <div className="empty-state">No comments yet.</div>
        )}
        {comments &&
          comments.map((c) => {
            const isOwner = user && c.author?._id === user.id;
            return (
              <div className="comment" key={c._id}>
                <div className="comment-meta">
                  <span className="comment-author">
                    <Avatar src={c.author?.avatar} name={c.author?.name} size={22} />
                    {c.author?.name || 'Unknown'} · {timeAgo(c.createdAt)}
                  </span>
                  {isOwner && (
                    <button className="link-btn" onClick={() => handleDeleteComment(c._id)}>
                      Delete
                    </button>
                  )}
                </div>
                <div>{c.text}</div>
              </div>
            );
          })}
      </section>
    </>
  );
}
