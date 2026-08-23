// Christine's part
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch, timeAgo } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function Profile() {
  const { id } = useParams();
  const { user: me, isLoggedIn } = useAuth();

  const [data, setData] = useState(null); // { user, posts }
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    setError('');
    apiFetch(`/users/${id}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="error show">{error}</div>;
  if (!data) return <p className="hint">Loading profile…</p>;

  const { user, posts } = data;
  const isMe = me && me.id === user._id;

  return (
    <>
      <div className="card profile-header">
        <Avatar src={user.avatar} name={user.name} size={72} />
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <p className="hint" style={{ marginTop: 4 }}>
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <div className="row-actions" style={{ marginTop: 10 }}>
            {isMe ? (
              <Link className="btn secondary" to="/profile/edit">
                Edit profile
              </Link>
            ) : (
              isLoggedIn && (
                <Link className="btn" to={`/messages/${user._id}`}>
                  Message
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <h2 className="page-title" style={{ marginBottom: 12 }}>
        Posts by {user.name}
      </h2>

      {posts.length === 0 && <div className="empty-state">No posts yet.</div>}

      {posts.map((post) => (
        <article className="feed-card" key={post._id}>
          <div className="feed-card-header">
            <span className="hint">{timeAgo(post.createdAt)}</span>
          </div>
          {post.image && (
            <Link to={`/posts/${post._id}`}>
              <img src={post.image} alt="" className="feed-card-image" />
            </Link>
          )}
          <div className="feed-card-actions">
            <span className="like-btn liked-static">♥ {post.likeCount ?? 0}</span>
          </div>
          {post.content && (
            <p className="feed-card-caption">
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
