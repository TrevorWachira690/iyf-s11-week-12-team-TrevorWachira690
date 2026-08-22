import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import PostCard from '../components/PostCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SearchBar from '../components/SearchBar.jsx';
import SEO from '../components/SEO.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import HeroSection from '../components/HeroSection.jsx';

const ALL_CATEGORIES = ['All', 'Electronics', 'Web Development', 'Data Analysis', 'Clothing Shopping', 'Design', 'Marketing', 'Writing', 'Photography', 'Music', 'Video', 'Other'];
const VISIBLE_CATEGORY_COUNT = 4;

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAllCategoriesMenu, setShowAllCategoriesMenu] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formError, setFormError] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await api.getPosts();
        setListings(data.listings || data.posts || []);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadListings();
  }, []);

  function handleSearchQuery(query) {
    if (!query) {
      setSearchResults(null);
      return;
    }
    api.searchPosts(query).then((data) => {
      setSearchResults(data.listings || data.posts || []);
    }).catch(() => {
      setSearchResults([]);
    });
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image is too large. Please use photos under 5MB each.');
        return;
      }
    }
    
    setImageFiles(previousFiles => {
      const existingFilenames = new Set(previousFiles.map(file => file.name));
      const newFiles = files.filter(file => !existingFilenames.has(file.name));
      return [...previousFiles, ...newFiles];
    });
    
    files.forEach(file => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreviews(previous => [...previous, fileReader.result]);
        setFormData(previous => ({
          ...previous,
          images: [...new Set([...(previous.images || []), fileReader.result])]
        }));
      };
      fileReader.readAsDataURL(file);
    });
  }

  async function handleCreateListing(event) {
    event.preventDefault();
    setFormError('');
    setIsFormLoading(true);
    try {
      await api.createPost({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        images: formData.images || []
      });
      setShowCreateForm(false);
      setFormData({ 
        title: '', 
        description: '', 
        price: '', 
        category: '', 
        image: '',
        images: []
      });
      setImageFiles([]);
      setImagePreviews([]);
      const data = await api.getPosts();
      setListings(data.listings || data.posts || []);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsFormLoading(false);
    }
  }

  const activeSearchResults = searchResults !== null ? searchResults : listings;
  const filteredListings = activeCategory === 'All'
    ? activeSearchResults
    : activeSearchResults.filter((listingItem) => listingItem.category === activeCategory);

  return (
    <>
      <SEO 
        title="TBM-DeepIn - Small Business Marketplace" 
        description="Browse and create marketplace listings for small businesses" 
      />
      
      <div className="max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="rounded-xl bg-slate-900/30 dark:bg-slate-800/50 p-4 mb-6 border border-slate-200/20 dark:border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">TBM-DeepIn</h1>
            {user?.role === 'business' && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
              >
                {showCreateForm ? 'Cancel' : '+ Create Listing'}
              </button>
            )}
          </div>
          
          <SearchBar onSearch={handleSearchQuery} />
          
          {showCreateForm && (
            <form onSubmit={handleCreateListing} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
              <h2 className="text-lg font-semibold">Create New Listing</h2>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <input
                type="text"
                placeholder="Listing title"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                required
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                required
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                required
                min={0}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <select
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                required
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select category</option>
                {ALL_CATEGORIES.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Images (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((previewSrc, index) => (
                      <div key={index} className="relative">
                        <img
                          src={previewSrc}
                          alt={`Product preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreviews(previous => previous.filter((_, i) => i !== index));
                            setFormData(previous => ({
                              ...previous,
                              images: previous.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isFormLoading}
                className="w-full bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 disabled:opacity-50"
              >
                {isFormLoading ? 'Creating...' : 'Create Listing'}
              </button>
            </form>
          )}
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {ALL_CATEGORIES.slice(0, VISIBLE_CATEGORY_COUNT).map((categoryName) => (
                <button
                  key={categoryName}
                  onClick={() => setActiveCategory(categoryName)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === categoryName
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {categoryName}
                </button>
              ))}
              {ALL_CATEGORIES.length > VISIBLE_CATEGORY_COUNT && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowAllCategoriesMenu(!showAllCategoriesMenu);
                    }}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    See More
                  </button>
                  {showAllCategoriesMenu && (
                    <div 
                      className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded shadow-lg z-50"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {ALL_CATEGORIES.slice(VISIBLE_CATEGORY_COUNT).map((categoryName) => (
                        <button
                          key={categoryName}
                          onClick={() => {
                            setActiveCategory(categoryName);
                            setShowAllCategoriesMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {categoryName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <HeroSection />

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading listings...</div>
        ) : filteredListings.length === 0 ? (
          <EmptyState
            title={searchResults !== null ? 'No results found' : activeCategory === 'All' ? 'No listings yet' : `No listings in ${activeCategory}`}
            message={searchResults !== null ? 'Try a different search term' : activeCategory === 'All' ? 'Be the first to create a listing!' : `Try a different category or create a listing in ${activeCategory}`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listingItem) => (
              <PostCard key={listingItem._id} post={listingItem} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
