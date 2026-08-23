import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

const POLL_MS = 4000;

export default function Conversation() {
  const { userId } = useParams();
  const { token, user: me } = useAuth();

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await apiFetch(`/messages/${userId}`, { token });
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setMessages(null);
    setError('');

    // Grab basic profile info for the header (name/avatar).
    apiFetch(`/users/${userId}`)
      .then((data) => setOtherUser(data.user))
      .catch(() => {});

    loadMessages();

    pollRef.current = setInterval(loadMessages, POLL_MS);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');
    try {
      await apiFetch(`/messages/${userId}`, {
        method: 'POST',
        token,
        body: { text: text.trim() },
      });
      setText('');
      await loadMessages();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <p>
        <Link to="/messages">&larr; Back to messages</Link>
      </p>

      <div className="card conversation-header">
        {otherUser && <Avatar src={otherUser.avatar} name={otherUser.name} size={40} />}
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>
          {otherUser ? (
            <Link to={`/users/${otherUser._id}`}>{otherUser.name}</Link>
          ) : (
            'Conversation'
          )}
        </h1>
      </div>

      <div className="card thread">
        {error && <div className="error show">{error}</div>}
        {messages === null && !error && <p className="hint">Loading messages…</p>}
        {messages && messages.length === 0 && (
          <div className="empty-state">No messages yet. Say hello!</div>
        )}
        {messages &&
          messages.map((m) => {
            const mine = m.sender === me.id;
            return (
              <div key={m._id} className={`bubble-row ${mine ? 'mine' : ''}`}>
                <div className="bubble">{m.text}</div>
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="send-bar">
        <textarea
          placeholder="Write a message…"
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <button type="submit" disabled={sending || !text.trim()}>
          Send
        </button>
      </form>
    </>
  );
}
