import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to your backend port
});

export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const fetchComments = (postId) => API.get(`/posts/${postId}/comments`);
export const createComment = (postId, commentData) =>
  API.post(`/posts/${postId}/comments`, commentData);

export default API;