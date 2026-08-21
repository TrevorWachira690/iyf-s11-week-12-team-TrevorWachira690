import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import EmptyState from '../components/EmptyState.jsx';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.getUser(id);
        setProfile(data.user);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <EmptyState title="User not found" message="The user you're looking for doesn't exist." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{profile.businessName || profile.username}</h1>
        <p className="text-gray-600 dark:text-gray-400 capitalize">{profile.role}</p>
        {profile.location && <p className="text-gray-600 dark:text-gray-400">{profile.location}</p>}
        {profile.description && <p className="text-gray-700 dark:text-gray-300 mt-4">{profile.description}</p>}
      </div>
    </div>
  );
}
