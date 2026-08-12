"use client";

import { useEffect, useRef } from "react";
import { ApkDownloadLink } from "./ApkDownloadLink";

const images = {
  breakfast: "https://images.unsplash.com/photo-1673819216767-e6f7e049ba47?auto=format&fit=crop&w=1200&q=90",
  dinner: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=88",
  coffee: "https://images.unsplash.com/photo-1541605044787-1efc3fccef3c?auto=format&fit=crop&w=800&q=88",
  travel: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=88",
};

function useStoryMotion(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.querySelectorAll("[data-story-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("story-visible", entry.isIntersecting)),
      { threshold: 0.15 },
    );
    items.forEach((item) => observer.observe(item));
    let frame = 0;
    const parallax = () => {
      if (reduced || window.innerWidth < 768) return;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = root.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = Math.max(-1, Math.min(1, (window.innerHeight * 0.55 - rect.top) / window.innerHeight));
        root.style.setProperty("--story-shift", `${progress * 16}px`);
      });
    };
    parallax();
    window.addEventListener("scroll", parallax, { passive: true });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", parallax);
    };
  }, [ref]);
}

function DigitalJournal() {
  return (
    <div className="digital-journal" data-story-reveal>
      <div className="journal-left">
        <span className="journal-volume">MY FOOD DIARY · 08</span>
        <div className="journal-month"><b>2026</b><strong>08</strong></div>
        <i className="journal-line" />
        <h3>夏日早餐</h3>
        <p>一日之始，也值得<br />被认真地收藏。</p>
        <span className="journal-page">PAGE 017</span>
      </div>
      <div className="journal-photo">
        <img src={images.breakfast} alt="晨光落在吐司和咖啡上" />
        <span className="photo-mark">morning light</span>
        <i className="photo-dot dot-one" /><i className="photo-dot dot-two" />
      </div>
      <div className="journal-right">
        <div className="journal-meta"><div><small>TIME</small><b>08:32</b></div><i /><div><small>PLACE</small><b>东京</b></div></div>
        <div className="journal-food"><small>BREAKFAST</small><h4>吐司 <i /> 咖啡</h4></div>
        <blockquote><span>“</span>难得早起的一天，<br />阳光刚好落在餐桌上。<span>”</span></blockquote>
        <div className="journal-weather"><span>☼</span><div><small>WEATHER</small><b>晴 · 26°C</b></div></div>
        <div className="journal-sign">食光 · 夏日篇</div>
      </div>
    </div>
  );
}

function MemoryCard({ type, title, image, className }: { type: string; title: string; image: string; className: string }) {
  return <div className={`cta-memory ${className}`}><img src={image} alt="" /><div><small>{type}</small><b>{title}</b></div></div>;
}

export function StoryClosing() {
  const ref = useRef<HTMLElement>(null);
  useStoryMotion(ref);
  return (
    <section className="story-closing" id="story-diary" ref={ref}>
      <div className="story-transition" aria-hidden="true"><i /><span>✦</span></div>
      <div className="story-shell">
        <header className="story-heading" data-story-reveal>
          <small>YOUR STORY · YOUR TASTE</small>
          <h2>每个人，都有一本<br />属于自己的食光日记。</h2>
          <p>那些看似普通的一餐，最后都会成为生活的一部分。</p>
        </header>
        <DigitalJournal />
      </div>

      <div className="closing-cta" id="download">
        <div className="cta-light" aria-hidden="true" />
        <div className="cta-stage" data-story-reveal>
          <MemoryCard type="早餐" title="晨光与咖啡" image={images.breakfast} className="memory-breakfast" />
          <MemoryCard type="探店" title="街角的新味道" image={images.dinner} className="memory-shop" />
          <MemoryCard type="旅行" title="在东京的早晨" image={images.travel} className="memory-travel" />
          <MemoryCard type="聚餐" title="久违地围坐一起" image={images.coffee} className="memory-party" />
          <div className="cta-memory-center"><span>食光</span><small>Food · Memory · Life</small></div>
        </div>
        <div className="cta-copy" data-story-reveal>
          <span>BEGIN YOUR FOOD STORY</span>
          <h2>开始记录你的<br />第一份食光</h2>
          <p>今天吃了什么，也许以后<br />会成为一段很好的回忆。</p>
          <div className="cta-actions"><ApkDownloadLink className="cta-primary cta-download">下载 App <span>↓</span></ApkDownloadLink></div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-row"><a href="#top" aria-label="返回食光首页">食光</a><p>记录每一餐，收藏每一刻</p><span>Food · Memory · Life</span></div>
        <div className="footer-rule" />
        <small>© 2026 食光</small>
      </footer>
    </section>
  );
}
