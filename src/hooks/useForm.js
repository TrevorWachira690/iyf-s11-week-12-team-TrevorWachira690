// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// Not used anywhere yet - decide with your part whether to use this
// or leave it.
import { useState, useCallback } from 'react';

/**
 * Reusable form state hook.
 *
 * Usage for the comment form:
 *   const {
 *     values, handleChange, handleSubmit, resetForm, isSubmitting, error,
 *   } = useForm({
 *     initialValues: { content: '' },
 *     validate: (values) => {
 *       if (!values.content.trim()) return 'Comment cannot be empty.';
 *       return null;
 *     },
 *     onSubmit: async (values) => {
 *       await createComment(postId, values);
 *     },
 *   });
 */
export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      const validationError = validate ? validate(values) : null;
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        resetForm();
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, resetForm]
  );

  return { values, setValues, handleChange, handleSubmit, resetForm, isSubmitting, error };
}
