// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.

import React from 'react';

/**
 * Generic reusable input. Supports both single-line and multi-line
 * (textarea) use, since the comment box needs multiple lines but
 * login/register fields don't.
 */
export default function Input({
  as = 'input', // 'input' | 'textarea'
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error = null,
  rows = 3,
  className = '',
}) {
  const base =
    'w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const borderColor = error ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="w-full">
      {as === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`${base} ${borderColor} ${className}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${base} ${borderColor} ${className}`}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}