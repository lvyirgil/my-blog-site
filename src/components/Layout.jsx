// src/components/Layout.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import Hero from './Hero';
import ParticlesBackground from './ParticlesBackground';
import Live2DViewer from './Live2DViewer';

const images = [
  '/src/img/img1.jpg',
  '/src/img/img2.jpg',
  '/src/img/img3.jpg',
  '/src/img/img4.jpg',
  '/src/img/img5.jpg',
];

const Layout = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionImages, setTransitionImages] = useState({ from: null, to: null });
  const [progress, setProgress] = useState(0); // 0~1
  const rafRef = useRef();
  const intervalRef = useRef();

  // 切换图片定时器
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const nextImage = (currentImage + 1) % images.length;
      setTransitionImages({ from: currentImage, to: nextImage });
      setProgress(0);
      setTransitioning(true);
    }, 10000);
    return () => clearInterval(intervalRef.current);
  }, [currentImage]);

  // 动画帧推进
  useEffect(() => {
    if (!transitioning) return;
    let start;
    const duration = 2000; // 2秒
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setTransitioning(false);
        setCurrentImage(transitionImages.to);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [transitioning, transitionImages]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 只在非动画时渲染当前图片，动画时只渲染动画层 */}
      {!transitioning && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            filter: 'brightness(0.8) blur(2px)',
            transition: 'none',
          }}
        />
      )}
      {/* 动画期间只渲染新旧图片动画层 */}
      {transitioning && (
        <>
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${images[transitionImages.from]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
              opacity: 1 - progress,
              filter: 'brightness(0.8) blur(2px)',
              transition: 'none',
            }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${images[transitionImages.to]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
              opacity: progress,
              filter: 'brightness(0.8) blur(2px)',
              transition: 'none',
            }}
          />
        </>
      )}
      <ParticlesBackground />
      <div className="relative z-10">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="h-[50vh] flex items-center justify-center">
            <Hero />
          </div>
          <div className="card bg-base-100 bg-opacity-60 backdrop-blur-sm shadow-xl rounded-3xl">
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <header className="navbar mb-6 p-0">
                <div className="navbar-center flex-1">
                  <ul className="menu menu-horizontal px-1 text-lg">
                    <li><Link to="/">首页</Link></li>
                    <li><a>文章</a></li>
                    <li><a>友链</a></li>
                  </ul>
                </div>
                <div className="navbar-end">
                  <ThemeToggle />
                </div>
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <main className="lg:col-span-2 xl:col-span-3">
                  <Outlet />
                </main>
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Live2DViewer />
    </div>
  );
};

export default Layout;
