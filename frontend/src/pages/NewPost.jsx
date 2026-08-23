import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fileToCompressedDataUrl } from '../imageUtils.js';

export default function NewPost() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setImageBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setImage(dataUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setImageBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() && !image) {
      setError('Add some text, a photo, or both.');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/posts', {
        method: 'POST',
        token,
        body: { content, image },
      });
      navigate('/posts');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card narrow-card">
      <div className="top-actions" style={{ marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>New post</h1>
        <Link to="/posts" className="hint">
          Cancel
        </Link>
      </div>
      <p className="hint" style={{ marginBottom: 16 }}>
        Share text, a photo, or both.
      </p>

      {error && <div className="error show">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">What's on your mind?</label>
          <textarea
            id="content"
            maxLength={5000}
            placeholder="Write something…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: 130 }}
          />
        </div>

        <div>
          <label htmlFor="image">Photo (optional)</label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          {imageBusy && <span className="hint">Processing image…</span>}
          {image && (
            <div className="image-preview-wrap">
              <img src={image} alt="Preview" className="image-preview" />
              <button type="button" className="link-btn" onClick={() => setImage(null)}>
                Remove photo
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting || imageBusy}>
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </form>
    </div>
  );
}
