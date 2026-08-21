import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import PostCard from '../components/PostCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SEO from '../components/SEO.jsx';

export default function BusinessListings() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [businessData, listingsData] = await Promise.all([
          api.getUser(id),
          api.getPosts(),
        ]);
        
        setBusiness(businessData.user || businessData);
        
        const allListings = listingsData.listings || listingsData.posts || [];
        const businessListings = allListings.filter(
          (l) => l.author?._id === id || l.author === id
        );
        setListings(businessListings);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Loading business listings...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <EmptyState title="Business not found" message="The business you're looking for doesn't exist." />
      </div>
    );
  }

  const displayName = business.businessName || business.name || 'Business';

  return (
    <>
      <SEO 
        title={`${displayName} Listings — TBM-DeepIn`} 
        description={`${displayName}'s marketplace listings`} 
      />
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link 
            to="/" 
            className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            {business.avatar ? (
              <img
                src={business.avatar}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                {business.businessType === 'company' ? '🏢' : '💼'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {business.businessType === 'company' ? '🏢 Company' : '💼 Entrepreneur'}
              </p>
              {business.location && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{business.location}</p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Listings by {displayName}</h2>
        
        {listings.length === 0 ? (
          <EmptyState 
            title="No listings yet" 
            message={`${displayName} hasn't added any listings yet.`} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <PostCard key={listing._id} post={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}