import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';

const PostDetail = () => {
  const { id } = useParams();
  const { currentPost, loading, error, user, addComment, loadPost, setError } = useApp();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setSubmitting(true);
    try {
      await addComment(id, comment);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert message={error} type="error" onClose={() => setError(null)} />
        <Link to="/posts" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to all posts
        </Link>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/posts" className="text-blue-600 hover:text-blue-800">
          ← Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/posts" 
        className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center"
      >
        ← Back to all posts
      </Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Featured Image */}
        {currentPost.featuredImage && currentPost.featuredImage !== 'default-post.jpg' && (
          <img 
            src={`http://localhost:5000/uploads/${currentPost.featuredImage}`}
            alt={currentPost.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-8">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentPost.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span>By {currentPost.author?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {currentPost.category?.name || 'Uncategorized'}
              </span>
              <span>•</span>
              <span>{currentPost.viewCount} views</span>
            </div>

            {currentPost.excerpt && (
              <p className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-4 mb-6">
                {currentPost.excerpt}
              </p>
            )}
          </header>

          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentPost.content}
            </div>
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            {user && (
              <Link 
                to={`/edit/${currentPost._id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Edit Post
              </Link>
            )}
            <div className="text-sm text-gray-500">
              Last updated: {new Date(currentPost.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({currentPost.comments?.length || 0})
        </h2>

        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {submitting && <LoadingSpinner size="small" />}
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {currentPost.comments?.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {(!currentPost.comments || currentPost.comments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;