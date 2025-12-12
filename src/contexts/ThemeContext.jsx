// src/contexts/ThemeContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. 创建 Context
const ThemeContext = createContext();

// 2. 创建 Provider 组件
export const ThemeProvider = ({ children }) => {
  // 3. 定义主题状态，并从 localStorage 或系统偏好中获取初始值
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 如果没有保存的主题，则根据用户的系统设置
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  });

  // 4. 当主题变化时，执行副作用
  useEffect(() => {
    // 将 data-theme 属性应用到 <html> 元素上
    document.documentElement.setAttribute('data-theme', theme);
    // 保存主题设置到 localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 5. 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 6. 创建自定义 Hook，方便组件使用主题
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
