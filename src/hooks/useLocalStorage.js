// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.

import { useState, useEffect } from 'react';

/**
 * Persists a value in localStorage.
 * Use this ONLY for UI preferences (theme, sidebar open/closed, etc).
 * Do NOT use this for comments, likes, or anything the server owns.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error(`useLocalStorage: failed to read key "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`useLocalStorage: failed to write key "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}