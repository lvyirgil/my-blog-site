// src/components/Sidebar.jsx

import React from 'react';
import SearchWidget from './SearchWidget';
import TagsWidget from './TagsWidget';
import StatsWidget from './StatsWidget';

// 创建一个可复用的、带标题的卡片包裹组件（更透明+模糊效果）
const WidgetCard = ({ title, children }) => (
  <div className="card bg-base-100 bg-opacity-60 backdrop-blur-sm shadow-xl">
    <div className="card-body p-6">
      <h2 className="card-title text-lg font-bold">{title}</h2>
      <div className="divider mt-0 mb-4"></div>
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  return (
    // 使用 space-y-6 为所有卡片添加统一的垂直间距
    <aside className="space-y-6">
      <WidgetCard title="搜索文章">
        <SearchWidget />
      </WidgetCard>
      
      <WidgetCard title="标签云">
        <TagsWidget />
      </WidgetCard>
      
      <WidgetCard title="本站信息">
        <StatsWidget />
      </WidgetCard>
    </aside>
  );
};

export default Sidebar;
