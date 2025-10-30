import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const SearchFilter = ({ onSearch, onCategoryChange, selectedCategory }) => {
  const { categories } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    onSearch('');
    onCategoryChange('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Posts
          </label>
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title or content..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchInput || selectedCategory) && (
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;