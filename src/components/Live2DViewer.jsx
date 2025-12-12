// src/components/Live2DViewer.jsx

import React, { useState, useEffect } from 'react';
import Live2D from 'react-live2d';

// 固定使用 Mao 模型
const modelName = 'Mao';

const Live2DViewer = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let intervalId;
    const checkSdk = () => {
      if (window.Live2DCubismCore) {
        setIsReady(true);
        if (intervalId) clearInterval(intervalId);

        // 初始化 Live2DModel
        if (!window.Live2DModel && window.Live2D) {
          window.Live2DModel = new window.Live2D();
        }
      }
    };
    checkSdk();
    if (!window.Live2DCubismCore) {
      intervalId = setInterval(checkSdk, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    // 计算鼠标位置相对于屏幕中心的偏移量
    const offsetX = (clientX - innerWidth / 2) / (innerWidth / 2);
    const offsetY = (clientY - innerHeight / 2) / (innerHeight / 2);

    // 调用 Live2D 模型的 setDragging 方法
    if (window.Live2DModel && window.Live2DModel.setDragging) {
      window.Live2DModel.setDragging(offsetX, -offsetY);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {isReady && (
        <Live2D
          key={modelName}
          ModelList={[modelName]}
          PathFull='/Resources/'
          width={800}
          height={1200}
          left='-100px'
          bottom='-350px'
          TouchBody={['嘿嘿~', '干嘛戳我呀~', '好痒~']}
          TouchHead={['摸头杀~', '喜欢你哟~', '嘻嘻~']}
        />
      )}
    </>
  );
};

export default Live2DViewer;
