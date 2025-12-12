// src/components/TagsWidget.jsx

import React, { useState, useEffect } from 'react';

const TagsWidget = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("获取标签失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) {
    return <p>正在加载标签...</p>;
  }
  
  return (
    // 使用 flex 布局来排列标签
    <div className="flex flex-wrap gap-2"> 
      {tags.map(tag => (
        // ✨ 核心修改在这里 ✨
        // 我们使用了 DaisyUI 的 badge 和 badge-primary 类
        <a href="#" key={tag.name} className="badge badge-lg badge-primary gap-2">
          {tag.name}
          
          {/* ✨ 使用 badge 类来创建一个小圆圈显示数量 */}
          <div className="badge badge-neutral">
            {tag.count}
          </div>
        </a>
      ))}
    </div>
  );
};

export default TagsWidget;
