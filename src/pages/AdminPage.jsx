// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import ArticleManager from './ArticleManager';

const AdminPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // 页面加载时自动读取 localStorage 的 apiKey
  useEffect(() => {
    const savedKey = localStorage.getItem('blog_admin_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleLogin = async () => {
    if (!apiKey) {
      alert('请输入 API Key');
      return;
    }
    
    // 验证API Key只包含ASCII字符
    if (/[^\x00-\x7F]/.test(apiKey)) {
      alert('API Key 包含非法字符，请使用英文字母、数字和英文符号');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        headers: { 'x-api-key': apiKey }
      });
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('blog_admin_api_key', apiKey); // 登录成功后保存
      } else {
        alert('API Key 验证失败');
      }
    } catch (error) {
      alert('连接后端服务失败');
    }
  };

  if (!isAuthenticated) {
    return (
      // ✨ 使用 Tailwind 的 flex + H-screen + V-screen 来实现全屏居中
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl">后台管理登录</h2>
            
            {/* 表单控件 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">API Key</span>
              </label>
              <input
                type="password"
                placeholder="请输入您的 API Key"
                className="input input-bordered"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            {/* 登录按钮 */}
            <div className="form-control mt-6">
              <button className="btn btn-primary" onClick={handleLogin}>
                登 录
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // ✨ 登录后的主界面 (使用 DaisyUI 重建) ✨
  return (
    <div className="bg-base-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 头部和 Tabs 导航 */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">后台管理</h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">查看站点 &rarr;</a>
        </header>

        <div role="tablist" className="tabs tabs-lifted">
          <a role="tab" 
             className={`tab ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
             onClick={() => setActiveTab('dashboard')}>
            数据分析
          </a>
          <a role="tab" 
             className={`tab ${activeTab === 'articles' ? 'tab-active' : ''}`}
             onClick={() => setActiveTab('articles')}>
            文章管理
          </a>
        </div>

        {/* 内容区域 */}
        <main className="bg-base-100 p-6 rounded-b-box shadow-lg">
          {activeTab === 'dashboard' && <DashboardPage apiKey={apiKey} />}
          {activeTab === 'articles' && <ArticleManager apiKey={apiKey} />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
