// src/components/ParticlesBackground.jsx

import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// 引入雪花预设
import { loadSnowPreset } from "tsparticles-preset-snow";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // 加载雪花预设
    await loadSnowPreset(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // 粒子加载完成后的回调
    console.log('Particles loaded');
  }, []);

  // 雪花效果的配置
  const snowOptions = {
    preset: "snow", // 直接使用预设
    background: {
      opacity: 0, // 不覆盖背景
    },
    fullScreen: {
      enable: true,
      zIndex: 1, // 确保在内容下方
    },
    particles: {
      move: {
        speed: 1, // 雪花下落速度
      },
      size: {
        value: { min: 1, max: 3 }, // 雪花大小范围
      }
    }
  };

  // 樱花效果的配置（如果需要，可以切换到樱花）
  const sakuraOptions = {
    background: {
      opacity: 0,
    },
    fullScreen: {
      enable: true,
      zIndex: 1,
    },
    particles: {
      number: {
        value: 20, // 樱花数量不宜过多
      },
      color: {
        value: ["#ffc0cb", "#ffb6c1", "#ff69b4", "#db7093"], // 粉色系
      },
      shape: {
        type: "char", // 使用字符作为粒子
        options: {
          char: {
            value: ["🌸", "💮"], // 使用 emoji 作为樱花形状
            font: "Arial",
            weight: "400",
          },
        },
      },
      opacity: {
        value: { min: 0.5, max: 1 },
      },
      size: {
        value: { min: 10, max: 20 }, // 樱花大小
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom-right", // 向右下方飘落
        straight: false, // 不走直线
        outModes: "out",
        attract: {
            enable: true,
            rotate: { x: 300, y: 1200 },
        },
      },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={snowOptions} // 使用雪花效果，如果想用樱花请改为 sakuraOptions
    />
  );
};

export default ParticlesBackground;
