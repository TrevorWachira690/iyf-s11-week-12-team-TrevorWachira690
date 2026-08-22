import React from 'react';

// Sits at the bottom of the page content — NOT fixed/sticky, so it only
// becomes visible once the user has scrolled to the very end of a page.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {year} TBM-DeepIn. All rights reserved.
      </div>
    </footer>
  );
}
