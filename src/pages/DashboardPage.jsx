// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

const DashboardPage = ({ apiKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setChartKey(prev => prev + 1);
    
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats', {
          headers: { 'x-api-key': apiKey }
        });
        const data = await response.json();
        if (isMounted.current) {
          setStats(data);
        }
      } catch (error) {
        console.error("获取统计数据失败:", error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    
    if(apiKey) fetchStats();
    
    return () => {
      isMounted.current = false;
    };
  }, [apiKey]);
  
  if (loading) return <div className="text-center p-8"><span className="loading loading-lg loading-spinner"></span></div>;
  if (!stats) return <div className="alert alert-error">无法加载统计数据。</div>;

  // --- ECharts 配置 ---
  const barChartOption = {
    title: { text: '热门文章 TOP 5' },
    tooltip: {},
    xAxis: {
      data: stats.topPosts.map(p => p.title),
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {},
    series: [{
      name: '浏览量',
      type: 'bar',
      data: stats.topPosts.map(p => p.view_count)
    }]
  };

  const pieChartOption = {
    title: { text: '文章分类占比', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '分类',
      type: 'pie',
      radius: '50%',
      data: Object.entries(stats.postsByTag).map(([name, value]) => ({ name, value })),
    }]
  };

  return (
    <div className="space-y-6">
      
      {/* ✨ 顶部基础数据卡片 (使用 stats 组件) ✨ */}
      <div className="stats shadow stats-vertical lg:stats-horizontal w-full">
        <div className="stat">
          <div className="stat-title">总文章数</div>
          <div className="stat-value">{stats.totalPosts}</div>
        </div>
        <div className="stat">
          <div className="stat-title">总浏览量</div>
          <div className="stat-value">{stats.totalViews}</div>
        </div>
        <div className="stat">
          <div className="stat-title">平均字数</div>
          <div className="stat-value">{Math.round(stats.avgWordCount)}</div>
        </div>
      </div>
      
      {/* ✨ 图表区域 (使用 card 组件) ✨ */}
      <div className="card bg-base-200 shadow-inner">
        <div className="card-body">
          <ReactECharts option={barChartOption} style={{ height: '400px' }}/>
        </div>
      </div>
      <div className="card bg-base-200 shadow-inner">
        <div className="card-body">
          <ReactECharts option={pieChartOption} style={{ height: '400px' }}/>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
