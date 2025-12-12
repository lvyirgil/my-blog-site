// src/pages/PostPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. ✨ 重新引入 react-markdown，这是最关键的一步
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = 'http://localhost:5000/api/posts';

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✨ 一个函数来检查内容是否是 PDF 标记
  const isPdfContent = (content) => {
    return content && content.startsWith('[PDF Viewer](');
  };
  
  const getPdfUrl = (content) => {
    const match = /\[PDF Viewer\]\((.*?)\)/.exec(content);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/${slug}`);
        if (!response.ok) {
          throw new Error(`文章'${slug}'未找到`);
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="card bg-base-100 bg-opacity-60 backdrop-blur-sm">正在加载文章...</div>;
  if (error) return <div className="card bg-base-100 bg-opacity-60 backdrop-blur-sm error">{error}</div>;
  if (!post) return null;

  return (
    // ✨ 为整个文章详情页应用更透明的卡片样式（从80%改为60%）
    <article className="card bg-base-100 bg-opacity-60 backdrop-blur-sm shadow-md">
      <div className="card-body">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="text-md text-base-content text-opacity-60 mt-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
        </header>

        {/* ✨ 使用 prose 类来自动美化 Markdown 内容 */}
        <section className="prose max-w-none">
          {isPdfContent(post.content) ? (
            // ✨ 如果是 PDF，渲染一个 iframe
            <iframe 
              src={getPdfUrl(post.content)} 
              width="100%" 
              height="800px" 
              title={post.title}
              style={{ border: 'none' }}
            ></iframe>
          ) : (
            // ✨ 否则，正常渲染 Markdown
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          )}
        </section>

        <div className="mt-8">
          <Link to="/" className="link link-hover">&larr; 返回首页</Link>
        </div>
      </div>
    </article>
  );
};

export default PostPage;
