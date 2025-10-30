import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const { posts, loading, loadPosts } = useApp();

  useEffect(() => {
    loadPosts(1, '', '');
  }, []);

  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Share Your Story With The World
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join our community of writers and readers. Create, share, and discover amazing content.
          </p>
          <div className="space-x-4">
            <Link
              to="/posts"
              className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors"
            >
              Explore Posts
            </Link>
            <Link
              to="/create"
              className="border-2 border-background text-background px-8 py-3 rounded-lg font-semibold hover:bg-background hover:text-foreground transition-colors"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Featured Posts</h2>
          <Link
            to="/posts"
            className="text-primary hover:text-primary/80 font-medium"
          >
            View All Posts →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post._id}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-border"
              >
                {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
                  <img
                    src={`http://localhost:5000/uploads/${post.featuredImage}`}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-primary font-medium">
                      {post.category?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2">
                    <Link 
                      to={`/posts/${post._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      By {post.author?.username}
                    </span>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your story with the community.
            </p>
            <Link
              to="/create"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-card rounded-lg shadow-md p-8 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl">✍️</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Write & Publish</h3>
            <p className="text-muted-foreground">Share your thoughts and stories with a global audience.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Join Community</h3>
            <p className="text-muted-foreground">Connect with readers and other writers worldwide.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-500 text-xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Engage & Discuss</h3>
            <p className="text-muted-foreground">Get feedback and engage in meaningful discussions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;