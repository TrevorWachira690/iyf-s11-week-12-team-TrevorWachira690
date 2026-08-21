import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';
import { getComments, createComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext'; // adjust if the hook name differs
import Card from './shared/Card';
import Button from './shared/Button';
import Input from './shared/Input';
import ConfirmDialog from './ConfirmDialog';

/**
 * Comment list + comment form for a single post.
 * Drop this into PostDetail.jsx below Part 2's listing info.
 *
 * Props:
 *   postId - string, required
 */
export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const {
    data,
    loading,
    error: loadError,
    setData,
  } = useFetch(() => getComments(postId), [postId]);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error: formError,
  } = useForm({
    initialValues: { content: '' },
    validate: (v) => (!v.content.trim() ? 'Comment cannot be empty.' : null),
    onSubmit: async (v) => {
      const newComment = await createComment(postId, { content: v.content });
      setData((prev) => ({
        comments: [newComment, ...(prev?.comments || [])],
      }));
    },
  });

  const confirmDelete = async () => {
    try {
      await deleteComment(pendingDeleteId);
      setData((prev) => ({
        comments: prev.comments.filter((c) => c._id !== pendingDeleteId),
      }));
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete comment.');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const comments = data?.comments || [];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900">Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <Input
            as="textarea"
            name="content"
            value={values.content}
            onChange={handleChange}
            placeholder="Write a comment..."
            error={formError}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-gray-500">Log in to comment.</p>
      )}

      {deleteError && <p className="mt-2 text-xs text-red-600">{deleteError}</p>}

      <div className="mt-4 flex flex-col gap-3">
        {loading && <p className="text-sm text-gray-500">Loading comments...</p>}
        {loadError && <p className="text-sm text-red-600">Unable to load comments.</p>}
        {!loading && !loadError && comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}

        {comments.map((comment) => (
          <Card key={comment._id} className="!p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {comment.author?.businessName || comment.author?.username || 'User'}
                </p>
                <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              {user && user._id === comment.author?._id && (
                <Button
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setPendingDeleteId(comment._id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!pendingDeleteId}
        title="Delete this comment?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}