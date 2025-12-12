import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/posts';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("获取文章失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // 使用 space-y-6 来为所有子元素（文章卡片）添加垂直间距
    <section className="space-y-6">
      {posts.map(post => (
        // ✨ 为每篇文章应用更透明的卡片样式（从80%改为60%）
        <article key={post.slug} className="card bg-base-100 bg-opacity-60 backdrop-blur-sm shadow-md transition-transform duration-300 hover:-translate-y-1">
          <div className="card-body">
            <h2 className="card-title text-2xl">
              <Link to={`/posts/${post.slug}`} className="link link-hover">{post.title}</Link>
            </h2>
            <div className="text-sm text-base-content text-opacity-60 mt-1">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString()}
              </time>
            </div>
            <p className="mt-4">{post.excerpt}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Home;
