// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.

import React from 'react';

/**
 * Generic content container. Used for post cards, comments,
 * dashboard sections — anywhere the app needs a bordered block.
 */
export default function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${
        padded ? 'p-4' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}