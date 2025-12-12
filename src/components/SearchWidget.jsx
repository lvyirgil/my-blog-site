// src/components/SearchWidget.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("搜索失败:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <> {/* 使用 Fragment，因为 card 样式由父组件提供 */}
      <form onSubmit={handleSearch} className="join w-full">
        {/* ✨ 使用 DaisyUI 的 join 类来组合输入框和按钮 */}
        <input 
          type="search" 
          placeholder="输入关键词..."
          className="input input-bordered join-item w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary join-item">搜索</button>
      </form>

      {/* 搜索结果 */}
      <div className="search-results mt-4">
        {isLoading && <span className="loading loading-spinner loading-sm"></span>}
        {!isLoading && hasSearched && results.length === 0 && <p>未找到相关文章。</p>}
        {!isLoading && results.length > 0 && (
          <ul className="menu text-sm">
            {results.map(post => (
              <li key={post.slug}>
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchWidget;
