// src/components/ThemeToggle.jsx

import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // 确保路径正确

const ThemeToggle = () => {
  // 从我们的主题上下文中获取当前主题和切换函数
  const { theme, toggleTheme } = useTheme();

  return (
    // ✨ 使用 DaisyUI 的 swap 组件来创建一个漂亮的切换动画图标 ✨
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      
      {/* 这个 input 是驱动切换的核心，但它本身是隐藏的 */}
      <input 
        type="checkbox" 
        onChange={toggleTheme}
        checked={theme === 'dark'}
      />
      
      {/* `swap-on` 是 'checked' 状态下显示的内容 (暗黑模式) */}
      <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
      </svg>
      
      {/* `swap-off` 是 'unchecked' 状态下显示的内容 (明亮模式) */}
      <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13.5A1,1,0,0,0,20.5,12,9,9,0,0,1,12,3a9,9,0,0,0,9,9,1,1,0,0,0,1-1.5A10,10,0,0,1,21.64,13.5Z"/>
      </svg>
      
    </label>
  );
};

export default ThemeToggle;
