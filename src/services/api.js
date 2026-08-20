// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// Every page that needs to talk to the backend goes through this
// file. Tell the whole team before changing a function that already
// exists here, since more than one part likely depends on it.



// ---- Comments and Reactions ----this is jacobs contribution dont delete it --------
/**
 * DO NOT create this as a new file. `src/services/api.js` already
 * exists and is shared by everyone (Part 1 and Part 2 have functions
 * in it already). Open the real file and ADD these functions to the
 * bottom. Do not delete or rename anything already in there.
 *
 * This assumes the file already has a configured axios instance or
 * fetch wrapper called `api` (or similar) that attaches the JWT auth
 * header automatically. If it doesn't, ask Person A / Part 1 how auth
 * headers are attached in this project before writing these.
 */

// ---- Comments ----

export const getComments = async (postId) => {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data; // expected shape: { comments: [...] }
};

export const createComment = async (postId, { content }) => {
  const res = await api.post(`/posts/${postId}/comments`, { content });
  return res.data; // expected shape: the created comment object
};

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

// ---- Reactions ----

export const likePost = async (postId) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data; // expected shape: { likes, dislikes, userReaction }
};

export const dislikePost = async (postId) => {
  const res = await api.post(`/posts/${postId}/dislike`);
  return res.data;
};

export const removeReaction = async (postId) => {
  const res = await api.delete(`/posts/${postId}/reaction`);
  return res.data;
};