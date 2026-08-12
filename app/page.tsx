"use client";

import { useEffect, useRef, useState } from "react";
import { FeatureSection } from "./components/FeatureSection";
import { StoryClosing } from "./components/StoryClosing";
import { ApkDownloadLink } from "./components/ApkDownloadLink";

const breakfastImage =
  "https://images.unsplash.com/photo-1673819216767-e6f7e049ba47?auto=format&fit=crop&w=900&q=88";

function SunIcon() {
  return <span className="sun-icon" aria-hidden="true">✦</span>;
}

function PhoneMockup() {
  return (
    <div className="phone-float">
      <div className="phone" aria-label="食光 App 首页预览">
        <div className="phone-screen">
          <div className="phone-status"><span>9:41</span><span>● ◒</span></div>
          <div className="phone-head">
            <div><p>六月十七 · 星期一</p><h2>早安，今天也要好好吃饭</h2></div>
            <div className="mini-avatar">食</div>
          </div>
          <div className="today-label"><span>今日饮食</span><span>2 / 3 已记录</span></div>
          <div className="food-card">
            <img src={breakfastImage} alt="咖啡与可颂早餐" />
            <div className="food-overlay">
              <div><b>晨光里的早餐</b><span>08:26 · 在家</span></div>
              <button aria-label="收藏这条饮食记录">♡</button>
            </div>
          </div>
          <div className="stats-card">
            <div><b>2</b><span>今日记录</span></div><i />
            <div><b>7</b><span>连续天数</span></div><i />
            <div><b>24</b><span>本月回忆</span></div>
          </div>
          <div className="memory-row">
            <div className="memory-copy"><span>⌁</span><div><b>收藏时刻</b><small>再看一次喜欢的味道</small></div></div>
            <span className="arrow">→</span>
          </div>
          <div className="phone-nav"><span className="active">⌂<small>记录</small></span><span>◫<small>时光</small></span><button aria-label="添加饮食记录">＋</button><span>♡<small>收藏</small></span><span>○<small>我的</small></span></div>
        </div>
      </div>
    </div>
  );
}

function MemoryFragments() {
  return (
    <div className="fragments" aria-hidden="true">
      <div className="fragment note-fragment"><span>今日小记</span><p>阳光很好，<br />可颂也刚刚好。</p><i>06 / 17</i></div>
      <div className="fragment photo-fragment"><img src={breakfastImage} alt="" /><span>morning</span></div>
      <div className="date-fragment"><b>17</b><span>JUN<br />MON</span></div>
      <div className="coffee-fragment"><div className="coffee-cup">◡</div><span>slow morning</span></div>
      <div className="plate-fragment"><i /><span /></div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const orientationBaseRef = useRef<{ beta: number; gamma: number } | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionPermissionNeeded, setMotionPermissionNeeded] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    const move = (event: PointerEvent) => {
      if (hero.classList.contains("hero-offscreen")) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      hero.style.setProperty("--mx", `${x * 24}px`);
      hero.style.setProperty("--my", `${y * 18}px`);
      hero.style.setProperty("--px", `${x * -10}deg`);
      hero.style.setProperty("--py", `${y * 7}deg`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => hero.classList.toggle("hero-offscreen", !entry.isIntersecting),
      { rootMargin: "80px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(max-width: 639px)").matches ||
      !("DeviceOrientationEvent" in window)
    ) return;

    const OrientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const timer = window.setTimeout(() => {
      if (typeof OrientationEvent.requestPermission === "function") {
        setMotionPermissionNeeded(true);
      } else {
        setMotionEnabled(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;
    const hero = heroRef.current;
    if (!hero) return;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const orientPhone = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      if (!orientationBaseRef.current) {
        orientationBaseRef.current = { beta: event.beta, gamma: event.gamma };
        return;
      }
      const beta = clamp(event.beta - orientationBaseRef.current.beta, -28, 28);
      const gamma = clamp(event.gamma - orientationBaseRef.current.gamma, -28, 28);
      hero.style.setProperty("--gyro-x", `${(gamma / 28) * 11}px`);
      hero.style.setProperty("--gyro-y", `${(beta / 28) * 7}px`);
      hero.style.setProperty("--gyro-rx", `${(beta / 28) * -5}deg`);
      hero.style.setProperty("--gyro-ry", `${(gamma / 28) * 7}deg`);
    };

    window.addEventListener("deviceorientation", orientPhone, true);
    return () => {
      window.removeEventListener("deviceorientation", orientPhone, true);
      orientationBaseRef.current = null;
      hero.style.removeProperty("--gyro-x");
      hero.style.removeProperty("--gyro-y");
      hero.style.removeProperty("--gyro-rx");
      hero.style.removeProperty("--gyro-ry");
    };
  }, [motionEnabled]);

  const enableMotion = async () => {
    const OrientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    try {
      const permission = await OrientationEvent.requestPermission?.();
      if (permission === "granted") {
        setMotionEnabled(true);
        setMotionPermissionNeeded(false);
      }
    } catch {
      setMotionPermissionNeeded(false);
    }
  };

  const scrollToStory = () => document.querySelector("#day-story")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main>
      <section className="hero" ref={heroRef}>
        <div className="ambient" aria-hidden="true"><i className="ray ray-a" /><i className="ray ray-b" /><i className="ray ray-c" /><i className="ray ray-d" /><i className="glow" /><i className="grain" /></div>
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#top" aria-label="食光首页"><SunIcon /><span>食光</span></a>
          <div className="nav-links"><a href="#day-story">核心功能</a><a href="#story-diary">食光故事</a><ApkDownloadLink className="nav-cta">下载 App <span>↓</span></ApkDownloadLink></div>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy" id="story">
            <div className="eyebrow"><span>✦</span> FOOD · MEMORY · LIFE</div>
            <h1>食<span>光</span></h1>
            <h2>记录每一餐，收藏每一刻</h2>
            <p className="english">Capture your food memories.</p>
            <div className="copy-rule" />
            <p className="description">食光，让每一次用餐<br className="mobile-break" />都成为值得保存的生活记忆。</p>
            <div className="actions"><button className="primary" onClick={scrollToStory}>开始记录 <span>→</span></button><ApkDownloadLink className="secondary"><span className="download-icon">↓</span> 下载 App</ApkDownloadLink></div>
            <div className="trust"><div className="avatars"><i>食</i><i>味</i><i>光</i></div><span><b>10,000+</b> 个温暖瞬间正在被收藏</span></div>
            {motionPermissionNeeded && (
              <button className="motion-permission" onClick={enableMotion} type="button">
                开启体感互动 <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>

          <div className="showcase">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <MemoryFragments /><PhoneMockup />
          </div>
        </div>
        <button className="scroll-cue" onClick={scrollToStory} aria-label="滚动查看一天的食光"><span>SCROLL TO DISCOVER</span><i>⌄</i></button>
      </section>

      <section className="legacy-day-story" aria-hidden="true">
        <div className="timeline-light" aria-hidden="true" />
        <div className="section-kicker">A DAY IN FOOD</div>
        <h2>一天的食物，<br />组成生活的时间轨迹。</h2>
        <p>每一次按下快门，都是与此刻生活的温柔相认。</p>
        <div className="timeline">
          <article><span className="time">08:26</span><div className="timeline-icon">☕</div><div><small>MORNING</small><h3>早餐</h3><p>一杯咖啡，唤醒新的一天</p></div></article>
          <article><span className="time">12:40</span><div className="timeline-icon">🍱</div><div><small>NOON</small><h3>午餐</h3><p>忙碌之间，也认真照顾自己</p></div></article>
          <article><span className="time">19:15</span><div className="timeline-icon">🍲</div><div><small>EVENING</small><h3>晚餐</h3><p>围坐与分享，是一天的归处</p></div></article>
        </div>
      </section>
      <FeatureSection />
      <StoryClosing />
    </main>
  );
}
