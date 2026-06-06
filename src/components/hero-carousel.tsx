"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "影像诊断",
    title: "专业影像设备，让诊断依据更清晰",
    description: "聚焦 CT、超声与数字影像能力，呈现宠物医疗服务的专业度。",
    metric: "精准诊断",
    theme: "imaging",
  },
  {
    eyebrow: "手术中心",
    title: "标准化手术环境，守护每一次治疗",
    description: "以洁净、稳定、可追踪的专业设备体系，支撑复杂医疗场景。",
    metric: "安全治疗",
    theme: "surgery",
  },
  {
    eyebrow: "重症监护",
    title: "全天候生命监护，及时响应关键变化",
    description: "通过连续监测与专业护理，为危重宠物提供稳定支持。",
    metric: "持续守护",
    theme: "icu",
  },
  {
    eyebrow: "医学检验",
    title: "高效实验室检验，缩短诊疗决策时间",
    description: "从血液分析到生化检测，让关键指标更快抵达临床一线。",
    metric: "快速检验",
    theme: "laboratory",
  },
  {
    eyebrow: "专业诊疗",
    title: "以专业能力，回应每一份信任",
    description: "连接设备、医生与服务流程，持续提升宠物医疗体验。",
    metric: "安心服务",
    theme: "care",
  },
] as const;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="hero-carousel"
      aria-label="瑞鹏专业医疗能力轮播"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="hero-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <article
            key={slide.theme}
            className={`hero-slide hero-slide-${slide.theme}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="hero-slide-copy">
              <p className="hero-slide-eyebrow">{slide.eyebrow}</p>
              <h2>{slide.title}</h2>
              <p className="hero-slide-description">{slide.description}</p>
              <div className="hero-slide-meta">
                <span className="hero-pulse" />
                <span>{slide.metric}</span>
                <span className="hero-slide-count">0{index + 1} / 0{slides.length}</span>
              </div>
            </div>
            <MedicalVisual theme={slide.theme} />
          </article>
        ))}
      </div>

      <button type="button" className="hero-carousel-arrow hero-carousel-arrow-left" onClick={goToPrevious} aria-label="上一张">
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="hero-carousel-arrow hero-carousel-arrow-right" onClick={goToNext} aria-label="下一张">
        <span aria-hidden="true">→</span>
      </button>

      <div className="hero-carousel-dots" aria-label="选择轮播内容">
        {slides.map((slide, index) => (
          <button
            key={slide.theme}
            type="button"
            aria-label={`查看第 ${index + 1} 张：${slide.eyebrow}`}
            aria-current={index === activeIndex}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

function MedicalVisual({ theme }: { theme: (typeof slides)[number]["theme"] }) {
  return (
    <div className="hero-medical-visual" aria-hidden="true">
      <div className="hero-orbit hero-orbit-large" />
      <div className="hero-orbit hero-orbit-small" />
      <div className="hero-visual-grid" />
      <div className="hero-device">
        {theme === "imaging" ? <ImagingIcon /> : null}
        {theme === "surgery" ? <SurgeryIcon /> : null}
        {theme === "icu" ? <MonitorIcon /> : null}
        {theme === "laboratory" ? <LaboratoryIcon /> : null}
        {theme === "care" ? <CareIcon /> : null}
      </div>
    </div>
  );
}

function ImagingIcon() {
  return (
    <svg viewBox="0 0 240 240">
      <circle cx="120" cy="112" r="72" />
      <circle cx="120" cy="112" r="40" />
      <path d="M50 178h140M70 178v20h100v-20M120 72v80M80 112h80" />
    </svg>
  );
}

function SurgeryIcon() {
  return (
    <svg viewBox="0 0 240 240">
      <path d="M46 160h148M66 160v30M174 160v30M72 132h96c14 0 26 12 26 28H46c0-16 12-28 26-28Z" />
      <path d="M120 45v46M78 55l24 40M162 55l-24 40M93 95h54l15 25H78l15-25Z" />
      <circle cx="120" cy="110" r="8" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 240 240">
      <rect x="42" y="52" width="156" height="112" rx="14" />
      <path d="M58 112h26l14-28 22 56 18-42 14 14h30M92 188h56M120 164v24" />
    </svg>
  );
}

function LaboratoryIcon() {
  return (
    <svg viewBox="0 0 240 240">
      <path d="M84 44h72M102 44v62l-46 72c-8 12 1 28 15 28h98c14 0 23-16 15-28l-46-72V44" />
      <path d="M82 150h76M94 128h52" />
      <circle cx="110" cy="172" r="7" />
      <circle cx="139" cy="184" r="5" />
    </svg>
  );
}

function CareIcon() {
  return (
    <svg viewBox="0 0 240 240">
      <path d="M120 196s-70-38-70-92c0-30 35-47 70-16 35-31 70-14 70 16 0 54-70 92-70 92Z" />
      <path d="M88 124h20l12-24 16 48 12-24h18" />
    </svg>
  );
}
