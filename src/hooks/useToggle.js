// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.

import { useState, useCallback } from 'react';

/**
 * Generic boolean toggle hook.
 * Usage: const [isOpen, toggleOpen, setOpen] = useToggle(false);
 */
export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}