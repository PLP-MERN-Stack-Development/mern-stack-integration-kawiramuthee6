import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { 
    user, 
    categories, 
    currentPost, 
    loading, 
    error, 
    createPost, 
    updatePost, 
    loadPost,
    setError 
  } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    excerpt: '',
    tags: '',
    isPublished: true
  });
  
  const [submitting, setSubmitting] = useState(false);

  // Debug: Check authentication status
  useEffect(() => {
    console.log('🔐 PostForm - Current user:', user);
    console.log('🔐 PostForm - Token in localStorage:', localStorage.getItem('token'));
    console.log('🔐 PostForm - Is authenticated:', !!user);
  }, [user]);

  // Show authentication message if not logged in
  if (!user) {
    console.log('🚫 PostForm: User not authenticated, showing login prompt');
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please log in to create or edit posts.</p>
        <Link
          to="/login"
          state={{ from: isEditing ? `/edit/${id}` : '/create' }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Load post data if editing
  useEffect(() => {
    if (isEditing && id) {
      console.log('📝 Loading post for editing:', id);
      loadPost(id);
    }
  }, [isEditing, id]);

  // Populate form when currentPost changes
  useEffect(() => {
    if (isEditing && currentPost) {
      console.log('📝 Populating form with post data:', currentPost);
      setFormData({
        title: currentPost.title || '',
        content: currentPost.content || '',
        category: currentPost.category?._id || '',
        excerpt: currentPost.excerpt || '',
        tags: currentPost.tags?.join(', ') || '',
        isPublished: currentPost.isPublished ?? true
      });
    }
  }, [isEditing, currentPost]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Submitting post form...');
    console.log('📝 Form data:', formData);
    setSubmitting(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      console.log('📤 Sending post data to API:', postData);

      if (isEditing) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      
      console.log('✅ Post created/updated successfully');
      navigate('/posts');
    } catch (err) {
      console.error('❌ Error creating post:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your blog post' : 'Share your story with the world'}
        </p>
        <p className="text-sm text-green-600 mt-1">
          ✅ Logged in as: {user?.username}
        </p>
      </div>

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a compelling title..."
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of your post (optional)"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="Write your post content here..."
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Published Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Link
            to="/posts"
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
          >
            {submitting && <LoadingSpinner size="small" />}
            <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;