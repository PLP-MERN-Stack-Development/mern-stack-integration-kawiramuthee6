import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, postService, categoryService } from '../services/api';

const AppContext = createContext();

// Safe localStorage parsing function
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    console.log('🔍 Stored user value:', user, 'Type:', typeof user);
    
    // Handle the string "undefined" and other invalid cases
    if (user === 'undefined' || user === 'null' || user === '""' || !user) {
      console.log('🧹 Clearing invalid user data from localStorage');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
    
    const parsedUser = JSON.parse(user);
    console.log('✅ Successfully parsed user:', parsedUser);
    return parsedUser;
  } catch (error) {
    console.error('❌ Error parsing stored user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  posts: [],
  categories: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      try {
        console.log('💾 Saving user to localStorage:', action.payload);
        localStorage.setItem('user', JSON.stringify(action.payload));
      } catch (error) {
        console.error('❌ Error saving user to localStorage:', error);
      }
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      console.log('🚪 Logging out - clearing localStorage');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { ...state, user: null, posts: [] };
    
    case 'SET_POSTS':
      return { 
        ...state, 
        posts: action.payload.posts,
        pagination: action.payload.pagination,
        loading: false 
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };
    
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost: state.currentPost?._id === action.payload._id ? action.payload : state.currentPost,
      };
    
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
      };
    
    case 'ADD_COMMENT':
      if (state.currentPost && state.currentPost._id === action.payload.postId) {
        return {
          ...state,
          currentPost: {
            ...state.currentPost,
            comments: [...state.currentPost.comments, action.payload.comment]
          }
        };
      }
      return state;
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Clean up any remaining invalid localStorage data on app start
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('🔍 App starting - checking localStorage:');
    console.log('   User:', user);
    console.log('   Token:', token ? 'Present' : 'Missing');
    
    if (user === 'undefined' || user === 'null' || user === '""') {
      console.log('🧹 Cleaning up invalid localStorage data on app start');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    
    login: (response) => {
      console.log('🔐 Login action - saving response data:', response);
      try {
        // FIXED: Access response.data.token and response.data.user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ Auth data saved to localStorage');
        console.log('✅ Token:', response.data.token ? 'Saved' : 'Missing');
        console.log('✅ User:', response.data.user);
      } catch (error) {
        console.error('❌ Error saving auth data to localStorage:', error);
      }
      dispatch({ type: 'SET_USER', payload: response.data.user });
    },
    
    logout: () => {
      console.log('🚪 Logout action triggered');
      dispatch({ type: 'LOGOUT' });
    },
    
    register: (response) => {
      console.log('👤 Register action - saving response data:', response);
      try {
        // FIXED: Access response.data.token and response.data.user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ Auth data saved to localStorage');
        console.log('✅ Token:', response.data.token ? 'Saved' : 'Missing');
        console.log('✅ User:', response.data.user);
      } catch (error) {
        console.error('❌ Error saving auth data to localStorage:', error);
      }
      dispatch({ type: 'SET_USER', payload: response.data.user });
    },
    
    loadPosts: async (page = 1, category = '', search = '') => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log('📖 Loading posts - page:', page, 'category:', category, 'search:', search);
        const response = await postService.getAllPosts(page, 10, category, search);
        console.log('✅ Posts loaded successfully:', response.data.length, 'posts');
        dispatch({ 
          type: 'SET_POSTS', 
          payload: {
            posts: response.data,
            pagination: response.pagination
          }
        });
      } catch (error) {
        console.error('❌ Error loading posts:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error.response?.data?.error || 'Failed to load posts' 
        });
      }
    },
    
    loadCategories: async () => {
      try {
        console.log('📂 Loading categories...');
        const response = await categoryService.getAllCategories();
        console.log('✅ Categories loaded successfully:', response.data.length, 'categories');
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      } catch (error) {
        console.error('❌ Failed to load categories:', error);
      }
    },
    
    loadPost: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log('📄 Loading post with ID:', id);
        const response = await postService.getPost(id);
        console.log('✅ Post loaded successfully:', response.data.title);
        dispatch({ type: 'SET_CURRENT_POST', payload: response.data });
      } catch (error) {
        console.error('❌ Error loading post:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error.response?.data?.error || 'Failed to load post' 
        });
      }
    },
    
    createPost: async (postData) => {
      try {
        console.log('📝 Creating new post:', postData.title);
        const response = await postService.createPost(postData);
        console.log('✅ Post created successfully:', response.data.title);
        dispatch({ type: 'ADD_POST', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('❌ Error creating post:', error);
        throw new Error(error.response?.data?.error || 'Failed to create post');
      }
    },
    
    updatePost: async (id, postData) => {
      try {
        console.log('✏️ Updating post with ID:', id);
        const response = await postService.updatePost(id, postData);
        console.log('✅ Post updated successfully:', response.data.title);
        dispatch({ type: 'UPDATE_POST', payload: response.data });
        return response.data;
      } catch (error) {
        console.error('❌ Error updating post:', error);
        throw new Error(error.response?.data?.error || 'Failed to update post');
      }
    },
    
    deletePost: async (id) => {
      try {
        console.log('🗑️ Deleting post with ID:', id);
        await postService.deletePost(id);
        console.log('✅ Post deleted successfully');
        dispatch({ type: 'DELETE_POST', payload: id });
      } catch (error) {
        console.error('❌ Error deleting post:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete post');
      }
    },
    
    addComment: async (postId, content) => {
      try {
        console.log('💬 Adding comment to post:', postId);
        const response = await postService.addComment(postId, { content });
        console.log('✅ Comment added successfully');
        dispatch({ 
          type: 'ADD_COMMENT', 
          payload: { postId, comment: response.data.comments.slice(-1)[0] }
        });
        return response.data;
      } catch (error) {
        console.error('❌ Error adding comment:', error);
        throw new Error(error.response?.data?.error || 'Failed to add comment');
      }
    },
  };

  // Load categories on app start
  useEffect(() => {
    console.log('🚀 App started - loading categories');
    actions.loadCategories();
  }, []);

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};