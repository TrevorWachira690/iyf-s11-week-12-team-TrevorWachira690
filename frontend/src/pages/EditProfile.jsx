// Christine's part
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fileToCompressedDataUrl } from '../imageUtils.js';
import Avatar from '../components/Avatar.jsx';

export default function EditProfile() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setImageBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, { maxDimension: 400, quality: 0.75 });
      setAvatar(dataUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setImageBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const updated = await apiFetch('/users/me', {
        method: 'PUT',
        token,
        body: { name, bio, avatar },
      });
      updateUser(updated);
      navigate(`/users/${user.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card narrow-card">
      <h1>Edit profile</h1>
      {error && <div className="error show">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar src={avatar} name={name} size={64} />
          <div>
            <label htmlFor="avatar">Avatar</label>
            <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            {imageBusy && <span className="hint">Processing…</span>}
          </div>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            maxLength={300}
            placeholder="Tell people a bit about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit" disabled={submitting || imageBusy}>
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
