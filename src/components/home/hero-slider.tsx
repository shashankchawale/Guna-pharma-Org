'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  image: string;
  alt: string;
  badge: string;
  tag: string;
}

const slides: Slide[] = [
  {
    id: 'hybrid',
    image: '/hero-poster-products.jpg',
    alt: 'Cosmetics & Medicines: Hyaluronic acid serum, revitalizing cream, Omega-3, and analgesic tablets',
    badge: 'Cosmetic Skincare & Quality Medicines',
    tag: 'Featured',
  },
  {
    id: 'cosmetics',
    image: '/hero-poster-cosmetics.jpg',
    alt: 'Luxury Cosmetics & Skincare: Advanced repair moisturizer, vitamin C glow serum, renewal cream, and SPF 50 sunscreen',
    badge: 'Luxury Skincare, Serums & Sunscreen',
    tag: 'Cosmetics',
  },
  {
    id: 'medicines',
    image: '/hero-poster-medicines.jpg',
    alt: 'Pharmaceutical Medicines: Novaclind capsules, Vita-B complex, paracetamol oral suspension, and antibiotic blister packs',
    badge: 'Clinical Medicines & Prescription Essentials',
    tag: 'Medicines',
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play timer (slides automatically every 5 seconds)
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full max-w-[340px] xs:max-w-sm sm:max-w-md lg:max-w-[490px] xl:max-w-[520px] mx-auto md:mx-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-white/15 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Product Showcase Slider"
    >
      {/* Aspect Ratio Container matched to native 1200x896 image ratio */}
      <div className="relative aspect-[1200/896] max-h-[230px] xs:max-h-[260px] sm:max-h-[310px] md:max-h-[350px] w-full overflow-hidden bg-[#003882]">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 640px) 340px, (max-width: 768px) 450px, (max-width: 1200px) 50vw, 520px"
                className={`object-cover object-center transform transition-transform duration-1000 ease-out ${
                  isActive ? 'scale-100' : 'scale-105'
                }`}
              />
            </div>
          );
        })}

        {/* Subtle ambient bottom gradient (kept light so all products remain fully visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001D47]/45 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Floating Badge Overlay with max-width protection so it never collides with dots */}
        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-20 max-w-[calc(100%-80px)] sm:max-w-[72%] rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-navy shadow-md flex items-center gap-1.5 transition-all duration-300">
          <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">{slides[currentIndex].badge}</span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-navy hover:scale-110 opacity-75 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-navy hover:scale-110 opacity-75 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-1.5 sm:px-2 py-0.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.tag}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-3.5 sm:w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
