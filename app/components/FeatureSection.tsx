"use client";

import { useEffect, useRef, useState } from "react";

const foodImages = [
  "https://images.unsplash.com/photo-1673819216767-e6f7e049ba47?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1541605044787-1efc3fccef3c?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=88",
];

const galleryImages = [
  foodImages[0],
  foodImages[1],
  foodImages[2],
  foodImages[3],
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=88",
];

function useFeatureProgress(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)),
      { threshold: 0.16 },
    );
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add("feature-active");
      },
      { rootMargin: "0px 0px -12%", threshold: 0.04 },
    );
    section.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
    sectionObserver.observe(section);
    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, [ref]);
}

function FeatureCopy({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="feature-copy" data-reveal>
      <span className="feature-number">{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
      <i className="feature-rule" />
    </div>
  );
}

function RecordPhone() {
  return (
    <div className="record-scene" data-reveal>
      <div className="record-tag record-tag-time"><small>早餐</small><b>08:30</b></div>
      <div className="record-tag record-tag-food"><span>吐司</span><i /> <span>咖啡</span></div>
      <div className="feature-phone">
        <div className="feature-phone-screen">
          <div className="feature-phone-status"><span>9:41</span><span>● ◒</span></div>
          <button className="phone-back" aria-label="返回">‹</button>
          <div className="record-head"><small>NEW MEMORY</small><h4>记录这一餐</h4><p>2026年8月12日 · 早餐</p></div>
          <div className="record-photo"><img src={foodImages[0]} alt="吐司和咖啡早餐" /><button aria-label="更换照片">＋</button></div>
          <div className="record-fields">
            <section><span>这一餐吃了什么</span><b>可颂吐司、拿铁咖啡</b></section>
            <div><section><span>时间</span><b>08:30</b></section><section><span>心情</span><b>轻松 ☺</b></section></div>
            <section><span>写下一句话</span><b className="handwritten">早晨的阳光和咖啡都刚刚好。</b></section>
          </div>
          <button className="save-memory">保存这份食光</button>
        </div>
      </div>
      <div className="record-date"><b>12</b><span>AUG<br />2026</span></div>
    </div>
  );
}

const places = [
  { id: "shanghai", city: "上海", date: "2026.08.12", food: "日式料理", note: "第一次来这家店。", x: "66%", y: "47%", image: foodImages[2] },
  { id: "hangzhou", city: "杭州", date: "2026.06.21", food: "龙井茶点", note: "雨后的茶香很轻。", x: "47%", y: "65%", image: foodImages[1] },
  { id: "beijing", city: "北京", date: "2026.04.03", food: "春日烤鸭", note: "和许久未见的人重逢。", x: "53%", y: "27%", image: foodImages[3] },
];

export function FoodMap() {
  const [active, setActive] = useState("shanghai");
  const place = places.find((item) => item.id === active) ?? places[0];
  return (
    <div className="food-map" data-reveal aria-label="食光地图，选择地点查看饮食回忆">
      <div className="map-top"><span>食光地图</span><small>3 个味道发生的地方</small></div>
      <div className="map-land land-one" /><div className="map-land land-two" /><div className="map-land land-three" />
      <div className="map-route route-one" /><div className="map-route route-two" />
      {places.map((item) => (
        <button
          key={item.id}
          className={`map-pin ${active === item.id ? "active" : ""}`}
          style={{ left: item.x, top: item.y }}
          onClick={() => setActive(item.id)}
          onMouseEnter={() => setActive(item.id)}
          aria-label={`查看${item.city}的饮食记录`}
        ><i /><span>{item.city}</span></button>
      ))}
      <div className={`map-memory-card card-${place.id}`} key={place.id}>
        <div className="map-card-photo"><img src={place.image} alt={`${place.city}${place.food}记录`} /></div>
        <div><small>{place.city} · {place.date}</small><h4>{place.food}</h4><p>“{place.note}”</p></div>
      </div>
      <div className="map-compass">N<span>✦</span></div>
    </div>
  );
}

export function MemoryGallery() {
  const memories = [
    { image: galleryImages[0], date: "08.12", note: "晨光里的第一口", cls: "gallery-one" },
    { image: galleryImages[1], date: "07.28", note: "两个人的晚餐", cls: "gallery-two" },
    { image: galleryImages[2], date: "06.17", note: "雨天的咖啡", cls: "gallery-three" },
    { image: galleryImages[3], date: "05.04", note: "旅行途中的一碗汤", cls: "gallery-four" },
    { image: galleryImages[4], date: "04.16", note: "春日里的一碗面", cls: "gallery-five" },
    { image: galleryImages[5], date: "03.09", note: "分享一桌新鲜", cls: "gallery-six" },
  ];
  return (
    <div className="memory-gallery" data-reveal>
      <div className="gallery-note"><small>MY FAVORITES</small><p>味道会淡去，<br />照片把那天留下。</p><span>食光手记</span></div>
      {memories.map((memory) => (
        <article className={`gallery-card ${memory.cls}`} key={memory.date}>
          <img src={memory.image} alt={memory.note} />
          <div><b>{memory.note}</b><span>{memory.date} / 2026</span></div>
        </article>
      ))}
      <div className="gallery-tape tape-one" /><div className="gallery-tape tape-two" />
    </div>
  );
}

export function Timeline() {
  return (
    <aside className="feature-timeline" aria-label="一天的饮食时间轨迹">
      <div className="timeline-track"><i /></div>
      <div className="feature-time-node node-breakfast"><i /><span><b>早餐</b><small>08:30</small></span></div>
      <div className="feature-time-node node-lunch"><i /><span><b>午餐</b><small>12:20</small></span></div>
      <div className="feature-time-node node-dinner"><i /><span><b>晚餐</b><small>19:10</small></span></div>
    </aside>
  );
}

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFeatureProgress(sectionRef);
  return (
    <section className="features-section" id="day-story" ref={sectionRef}>
      <div className="light-convergence" aria-hidden="true"><i /><span /></div>
      <header className="features-heading" data-reveal>
        <span>FOOD · MEMORY · LIFE</span>
        <h2>把每天吃过的，<br />都留在时间里</h2>
        <p>从一顿早餐，到一次旅行中的晚餐，<br />食光帮你记录每一个值得记住的味道。</p>
      </header>
      <Timeline />
      <div className="features-content">
        <article className="feature-block feature-record">
          <FeatureCopy number="01" title="记录这一餐">选择食物、填写信息，<br />把今天吃过的留在食光里。</FeatureCopy>
          <RecordPhone />
        </article>
        <article className="feature-block feature-map-block">
          <FoodMap />
          <FeatureCopy number="02" title="记住味道发生的地方">每一道食物，<br />都有属于它的位置。</FeatureCopy>
        </article>
        <article className="feature-block feature-gallery-block">
          <FeatureCopy number="03" title="收藏属于你的味觉记忆">喜欢的一餐、特别的一天，<br />都可以留在自己的食光收藏里。</FeatureCopy>
          <MemoryGallery />
        </article>
      </div>
      <footer className="feature-ending" data-reveal><span>✦</span><p>日子向前，味道留下。</p><small>KEEP THE MOMENTS THAT MATTER</small></footer>
    </section>
  );
}
