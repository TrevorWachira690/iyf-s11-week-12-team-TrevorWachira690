// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// The "are you sure?" popup shown before deleting something.

import React from 'react';
import Button from './shared/Button';

/**
 * Generic confirmation dialog for destructive actions (e.g. deleting
 * a comment). Controlled component — parent owns the open state.
 *
 * Usage:
 *   <ConfirmDialog
 *     isOpen={confirmOpen}
 *     title="Delete this comment?"
 *     message="This can't be undone."
 *     onConfirm={handleDelete}
 *     onCancel={() => setConfirmOpen(false)}
 *   />
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}