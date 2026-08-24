// Brian's part
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, timeAgo } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function Messages() {
  const { token } = useAuth();

  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState('');

  const [allUsers, setAllUsers] = useState(null);
  const [showDirectory, setShowDirectory] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch('/messages/conversations', { token })
      .then(setConversations)
      .catch((err) => setError(err.message));
  }, [token]);

  const openDirectory = async () => {
    setShowDirectory(true);
    if (allUsers === null) {
      try {
        const users = await apiFetch('/users', { token });
        setAllUsers(users);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers =
    allUsers?.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <>
      <div className="top-actions">
        <h1 className="page-title">Messages</h1>
        <button className="secondary" onClick={openDirectory}>
          New message
        </button>
      </div>

      {showDirectory && (
        <div className="card">
          <h2>Start a conversation</h2>
          <input
            type="text"
            placeholder="Search students by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 14 }}
          />
          {allUsers === null && <p className="hint">Loading students…</p>}
          {allUsers && filteredUsers.length === 0 && (
            <p className="hint">No students found.</p>
          )}
          {filteredUsers.map((u) => (
            <Link to={`/messages/${u._id}`} key={u._id} className="user-row">
              <Avatar src={u.avatar} name={u.name} size={36} />
              <span>{u.name}</span>
            </Link>
          ))}
        </div>
      )}

      {error && <div className="error show">{error}</div>}
      {conversations === null && !error && <p className="hint">Loading conversations…</p>}
      {conversations && conversations.length === 0 && (
        <div className="empty-state">
          No conversations yet. Click "New message" to message another student.
        </div>
      )}

      {conversations &&
        conversations.map((c) => (
          <Link to={`/messages/${c.user._id}`} key={c.user._id} className="conversation-row">
            <Avatar src={c.user.avatar} name={c.user.name} size={44} />
            <div className="conversation-row-body">
              <div className="conversation-row-top">
                <span className="conversation-name">{c.user.name}</span>
                <span className="hint">{timeAgo(c.lastMessageAt)}</span>
              </div>
              <div className="conversation-preview">{c.lastMessage}</div>
            </div>
            {c.unreadCount > 0 && <span className="unread-badge">{c.unreadCount}</span>}
          </Link>
        ))}
    </>
  );
}
