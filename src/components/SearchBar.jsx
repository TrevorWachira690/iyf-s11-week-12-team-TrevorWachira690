import React, { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  function handleClear() {
    setQuery('');
    onSearch('');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) {
          onSearch(query.trim());
        }
      }}
      className="flex gap-2 mb-4"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search listings by title, description, or category..."
        className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
