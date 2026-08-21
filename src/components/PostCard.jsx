import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

const PLACEHOLDER_IMAGE = 'https://placehold.net/600x400.png';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const author = post.author || {};
  const isBusinessUser = author.role === 'business';
  
  const primaryImage = post.images?.[0] || post.image;
  const hasPrimaryImage = primaryImage && primaryImage.trim() !== '';

  const handleBusinessClick = (event) => {
    event.stopPropagation();
    if (author._id) {
      navigate(`/business/${author._id}/listings`);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/posts/${post._id}`)}
      className="cursor-pointer border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200"
    >
      <div className="mb-3">
        {hasPrimaryImage ? (
          <img
            src={primaryImage}
            alt={post.title}
            className="w-full h-32 object-cover rounded"
            onError={(event) => {
              event.target.src = PLACEHOLDER_IMAGE;
              event.target.onerror = null;
            }}
          />
        ) : (
          <img
            src={PLACEHOLDER_IMAGE}
            alt={post.title}
            className="w-full h-32 object-cover rounded"
          />
        )}
      </div>

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          <Link to={`/posts/${post._id}`} onClick={(event) => event.stopPropagation()}>
            {post.title}
          </Link>
        </h3>
        <StatusBadge status={post.status} />
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
        {post.description}
      </p>

      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span className="truncate max-w-[80px]" title={author.name}>
            By {author.name || 'Unknown'}
          </span>
          {isBusinessUser && (
            <button
              onClick={handleBusinessClick}
              className="ml-auto text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              {author.businessType === 'company' ? '🏢' : '💼'}
            </button>
          )}
        </div>
        <span className="whitespace-nowrap">{formattedDate}</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">
          ${post.price?.toLocaleString()}
        </span>
        <Link 
          to={`/category/${post.category}`} 
          className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          {post.category}
        </Link>
      </div>
    </div>
  );
}