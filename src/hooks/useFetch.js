// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.

import { useState, useEffect, useCallback } from 'react';

/**
 * Centralizes loading/error/data state for a fetch-like function.
 * Best for GET requests that run automatically on mount or when deps change.
 * For mutations (POST/DELETE triggered by user actions), call the api
 * function directly instead — see CommentSection.jsx for that pattern.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch(
 *     () => getComments(postId),
 *     [postId]
 *   );
 */
export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load, setData };
}