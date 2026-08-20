import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import PostCard from '../components/PostCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SEO from '../components/SEO.jsx';

export default function CategoryPage() {
  const { category } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await api.getPosts();
        const allListings = data.listings || data.posts || [];
        const filtered = allListings.filter(
          (listing) => listing.category === category
        );
        setListings(filtered);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [category]);

  return (
    <>
      <SEO 
        title={`${category} Listings — TBM-DeepIn`} 
        description={`Browse all ${category} listings on TBM-DeepIn marketplace`} 
      />
      
      <div className="max-w-4xl mx-auto p-4">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 text-sm mb-4 inline-block">
          ← Back to all listings
        </Link>
        
        <h1 className="text-2xl font-bold mb-4">{category} Listings</h1>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading listings...</div>
        ) : listings.length === 0 ? (
          <EmptyState
            title={`No ${category} listings yet`}
            message={`Be the first to create a ${category} listing!`}
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