// src/components/StatsWidget.jsx

import React, { useState, useEffect } from 'react';

const StatsWidget = () => {
  const [days, setDays] = useState(0);
  
  useEffect(() => {
    const startDate = new Date('2025-10-01'); // 你的建站日期
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setDays(diffDays);
  }, []);

  return (
    // ✨ 使用 DaisyUI 的 stat 组件来展示数据
    <div className="stats stats-vertical shadow">
      <div className="stat">
        <div className="stat-title">建站天数</div>
        <div className="stat-value">{days} 天</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">本站总访问量</div>
        <div className="stat-value" id="busuanzi_value_site_pv">
          <span className="loading loading-dots loading-xs"></span>
        </div>
      </div>
      
      <div className="stat">
        <div className="stat-title">本站总访客数</div>
        <div className="stat-value" id="busuanzi_value_site_uv">
          <span className="loading loading-dots loading-xs"></span>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
