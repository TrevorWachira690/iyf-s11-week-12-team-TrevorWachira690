import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Profile() {
  const { id } = useParams();
  const { user: loggedInUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.getUser(id);
        setProfile(data.user);
        setListings(data.listings || []);
        setFormData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          avatar: data.user.avatar || '',
        });
        setAvatarPreview(data.user.avatar || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData({ ...formData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const data = await api.updateMe(formData);
      setProfile(data.user);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <EmptyState title="User not found" message="This user does not exist." />
      </div>
    );
  }

  const isOwnProfile = profile._id === loggedInUser?._id;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-indigo-600 dark:text-indigo-400 text-sm mb-4 inline-block">
        ← Back to listings
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
<p className="text-gray-500 text-sm">
               {profile.role === 'business' ? (
                 <span>
                   {profile.businessType === 'company' ? '🏢 Company' : '💼 Entrepreneur'}
                   {profile.businessName && ` — ${profile.businessName}`}
                 </span>
               ) : (
                 '👤 Customer'
               )}
             </p>
{profile.role === 'business' && profile.businessName && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {profile.businessName} — {profile.category}
          </p>
        )}
        {profile.role === 'business' && (
          <p className="text-sm text-gray-500 mt-1">
            📋 Business Type: {profile.businessType === 'company' ? 'Company' : 'Entrepreneur'}
          </p>
        )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>
        )}

        {profile.contactPhone && (
          <p className="text-sm">
            📞{' '}
            <a
              href={`https://wa.me/${profile.contactPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {profile.contactPhone}
            </a>
          </p>
        )}

        {isOwnProfile && (
          <>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            ) : (
              <form onSubmit={handleUpdate} className="mt-4 space-y-3">
                <div>
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                  )}
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Avatar URL (or upload above)"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">
        {profile.name}'s Listings ({listings.length})
      </h2>

      {listings.length === 0 ? (
        <EmptyState title="No listings" message={isOwnProfile ? 'Create your first listing!' : 'This user has no listings yet.'} />
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                <Link to={`/posts/${listing._id}`}>{listing.title}</Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="font-medium">${listing.price?.toLocaleString()}</span>
                <span>{listing.category}</span>
                <span>{listing.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}