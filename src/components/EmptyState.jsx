import React from 'react';

// Generic "nothing here" placeholder, reused wherever a list could be empty:
// no listings, no search results, no comments yet, etc.
export default function EmptyState({ title = 'Nothing here yet', message = '' }) {
  return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <p className="text-lg font-medium">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
}
