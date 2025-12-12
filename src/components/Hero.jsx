// src/components/Hero.jsx

import React, { useState, useEffect } from 'react';

const Hero = () => {
  const sentences = [
    '生活如叶，重重叠叠，只如砧般消逝在林间。',
    '岁月如歌，轻轻吟唱，回荡在心间。',
    '时光如水，缓缓流淌，滋润了岁月的痕迹。',
    '人生如梦，忽隐忽现，恍若一场烟花。',
    '记忆如风，悄然掠过，带走了昨日的温存。'
  ];

  const [currentSentence, setCurrentSentence] = useState(sentences[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // 开始淡出
      setTimeout(() => {
        const nextIndex = (sentences.indexOf(currentSentence) + 1) % sentences.length;
        setCurrentSentence(sentences[nextIndex]);
        setFade(true); // 开始淡入
      }, 500); // 与 CSS 动画时间一致
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSentence, sentences]);

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-white">
        你好, 欢迎来到我的博客
      </h1>
      <p
        className={`text-lg mt-4 text-white/80 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        {currentSentence}
      </p>
    </div>
  );
};

export default Hero;
