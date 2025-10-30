import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';
import SearchFilter from '../components/SearchFilter';

const PostList = () => {
  const { posts, loading, error, pagination, loadPosts, setError } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery]);

  const handleSearch = (search) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Blog Posts</h1>
        <p className="text-gray-600">Discover stories, thinking, and expertise from writers</p>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {[...Array(pagination.pages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-2 rounded border ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Post Card Component
const PostCard = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
        <img
          src={`http://localhost:5000/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span className="text-blue-600 font-medium">{post.category?.name}</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link 
            to={`/posts/${post._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150)}...
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            By {post.author?.username}
          </span>
          <Link
            to={`/posts/${post._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostList;