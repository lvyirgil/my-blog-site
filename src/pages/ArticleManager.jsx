// 工具栏按钮中英文对照表
const toolbarLabelMap = {
  'bold': '加粗',
  'italic': '斜体',
  'strike': '删除线',
  'title': '标题',
  'divider': '分割线',
  'quote': '引用',
  'unordered-list': '无序列表',
  'ordered-list': '有序列表',
  'code': '代码',
  'code-block': '代码块',
  'link': '插入链接',
  'image': '插入图片',
  'table': '表格',
  'help': '帮助',
  'preview': '预览',
  'fullscreen': '全屏',
  'edit': '编辑',
  'undo': '撤销',
  'redo': '重做',
};

// 挂载后将英文aria-label替换为中文
// import { useEffect } from 'react'; // Duplicate import removed

// src/pages/ArticleManager.jsx

import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/mdeditor.css';
import '../assets/mdeditor-toolbar-large.css';
import { useTheme } from '../contexts/ThemeContext';

const API_BASE_URL = 'http://localhost:5000/api';

const ArticleManager = ({ apiKey }) => {
  const [posts, setPosts] = useState([]);
  // 控制侧边栏展开/收起
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 表单状态
  const [currentPost, setCurrentPost] = useState({
    id: null,
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    tags: ''
  });
  const [isEditing, setIsEditing] = useState(false);


  // ✨ 获取当前主题
  const { theme } = useTheme();


  // 获取文章列表
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      alert('获取文章失败');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  // 选择一篇文章进行编辑
  const handleEdit = async (post) => {
    setIsEditing(true);
    // 如果有content直接用，否则拉取完整内容
    if (post.content) {
      setCurrentPost({
        ...post,
        tags: post.tags || '',
        content: post.content || '',
      });
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/${post.slug}`);
        if (res.ok) {
          const fullPost = await res.json();
          setCurrentPost({
            ...fullPost,
            tags: fullPost.tags || '',
            content: fullPost.content || '',
          });
        } else {
          setCurrentPost({ ...post, tags: post.tags || '', content: '' });
        }
      } catch {
        setCurrentPost({ ...post, tags: post.tags || '', content: '' });
      }
    }
  };
  
  // 清空表单，准备新建
  const handleNewPost = () => {
    setIsEditing(false);
    setCurrentPost({ id: null, slug: '', title: '', content: '', excerpt: '', tags: '' });
  };

  // 处理表单提交 (新建或更新)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `${API_BASE_URL}/posts/${currentPost.slug}` 
      : `${API_BASE_URL}/posts`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(currentPost),
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
      }
      alert(`文章已成功${isEditing ? '更新' : '创建'}!`);
      handleNewPost(); // 清空表单
      fetchPosts(); // 重新获取列表
    } catch (error) {
      alert(`操作失败: ${error.message}`);
    }
  };

  // 删除文章
  const handleDelete = async (slug) => {
    if (!window.confirm(`确定要删除文章 "${slug}" 吗？`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey },
      });
       if (!response.ok) throw new Error('删除失败');
      alert('文章已删除!');
      fetchPosts(); // 重新获取列表
    } catch (error) {
      alert(`删除失败: ${error.message}`);
    }
  };

  // ✨ 处理文件上传的函数
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file); // 'document' 必须和后端 upload.single('document') 一致

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData, // 发送 FormData 时，不要手动设置 Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '上传失败');
      }

      const data = await response.json();
      
      // ✨ 将解析出的内容填充到当前表单
      setCurrentPost(prev => ({
        ...prev,
        title: data.title,
        content: data.content,
      }));

      alert('文件上传成功并已解析内容！');

    } catch (error) {
      alert(`上传失败: ${error.message}`);
    }
  };

  // ✨ 处理图片上传并插入链接的函数
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // 'image' 必须和后端 upload.single('image') 一致

    try {
      const response = await fetch('http://localhost:5000/api/upload-image', {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body: formData,
      });

      if (!response.ok) throw new Error('图片上传失败');

      const data = await response.json();
      const imageUrl = data.imageUrl;
      
// 生成 Markdown 图片链接并追加到末尾
      const markdownLink = `\n![在这里输入图片描述](${imageUrl})\n`;

      setCurrentPost(prev => ({ 
        ...prev, 
        content: (prev.content || '') + markdownLink 
      }));
      
    } catch (error) {
      alert(`图片上传失败: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* 侧边栏：文章列表，可最小化 */}
      <div className={`transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 ${sidebarOpen ? 'w-80 min-w-[16rem]' : 'w-12 min-w-[3rem]'} overflow-hidden relative`}>
        {/* 展开/收起按钮，始终可见 */}
        <button
          className="absolute top-3 right-2 z-20 btn btn-ghost btn-xs rounded-full p-1"
          style={{ background: 'rgba(255,255,255,0.7)' }}
          title={sidebarOpen ? '收起' : '展开'}
          onClick={() => setSidebarOpen(v => !v)}
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          )}
        </button>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className={`font-bold text-lg text-gray-800 dark:text-gray-100 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>文章列表</span>
        </div>
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex justify-end p-2">
            <button className="btn btn-primary btn-xs rounded-full shadow-md transition-transform hover:scale-105" onClick={handleNewPost}>+ 新建</button>
          </div>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">标题</th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {posts.map(post => (
                <tr key={post.slug} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="px-2 py-1 font-medium text-gray-900 dark:text-gray-100 truncate max-w-[8rem]">{post.title}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <button onClick={() => handleEdit(post)} className="btn btn-outline btn-info btn-xs rounded-full transition-transform hover:scale-105">编辑</button>
                    <button onClick={() => handleDelete(post.slug)} className="btn btn-outline btn-error btn-xs rounded-full transition-transform hover:scale-105">删</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 主内容区：编辑/新建表单，最大化 */}
      <div className="flex-1 flex flex-col items-stretch justify-stretch p-0 sm:p-0">
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl shadow-xl p-2 sm:p-12 transition-all duration-300 flex-1 flex flex-col min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">{isEditing ? '编辑文章' : '新建文章'}</h2>
          {/* 文件上传 */}
          <div className="mb-6 flex items-center gap-4">
            <input 
              id="file-upload" 
              type="file" 
              onChange={handleFileUpload} 
              accept=".md,.docx,.pdf"
              className="file-input file-input-bordered w-full max-w-xs rounded-lg"
            />
            <label htmlFor="file-upload" className="btn btn-sm btn-primary rounded-full shadow-md transition-transform hover:scale-105">
              从文件导入
            </label>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">Slug (URL路径)</span></label>
              <input 
                type="text" 
                className="input input-bordered rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={currentPost.slug} 
                onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">标题</span></label>
              <input 
                type="text" 
                className="input input-bordered rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={currentPost.title} 
                onChange={e => setCurrentPost({...currentPost, title: e.target.value})} 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">摘要</span></label>
              <textarea 
                className="textarea textarea-bordered rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                rows="3"
                value={currentPost.excerpt} 
                onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} 
              />
            </div>
            <div className="form-control flex-1 flex flex-col">
              <label className="label flex-col sm:flex-row sm:items-center gap-2">
                <span className="label-text text-gray-700 dark:text-gray-200">内容 (Markdown)</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="image-upload" 
                    type="file" 
                    onChange={handleImageUpload} 
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs rounded-lg"
                  />
                  <label htmlFor="image-upload" className="btn btn-sm btn-secondary rounded-full shadow-md transition-transform hover:scale-105">
                    上传图片
                  </label>
                </div>
              </label>
              <div data-color-mode={theme === 'dark' ? 'dark' : 'light'} className="mt-2 flex-1">
                <MDEditor
                  value={currentPost.content}
                  onChange={(newValue) => {
                    setCurrentPost(prev => ({ ...prev, content: newValue || '' }));
                  }}
                  height={window.innerHeight > 700 ? 500 : 300}
                  preview="live"
                  style={{ minHeight: 300, maxHeight: 600 }}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-700 dark:text-gray-200">标签 (逗号分隔)</span></label>
              <input 
                type="text" 
                className="input input-bordered rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={currentPost.tags} 
                onChange={e => setCurrentPost({...currentPost, tags: e.target.value})} 
              />
            </div>
            <div className="form-control mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn btn-primary rounded-full shadow-md transition-transform hover:scale-105 px-8">
                {isEditing ? '更新' : '发布'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleNewPost} className="btn btn-ghost rounded-full border border-gray-300 dark:border-gray-600 shadow-md transition-transform hover:scale-105 px-8">
                  取消编辑
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleManager;
