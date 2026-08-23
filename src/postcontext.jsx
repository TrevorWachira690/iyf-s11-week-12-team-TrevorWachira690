import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchPosts, createComment as apiCreateComment } from './api.js';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchPosts();
      setPosts(response?.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId, commentText) => {
    try {
      const { data: newComment } = await apiCreateComment(postId, { text: commentText });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, loadPosts, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};