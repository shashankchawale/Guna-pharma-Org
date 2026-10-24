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
      className="relative w-full max-w-lg lg:max-w-xl overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/15 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Product Showcase Slider"
    >
      {/* Aspect Ratio Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className={`object-cover transform transition-transform duration-1000 ease-out ${
                  isActive ? 'scale-100' : 'scale-105'
                }`}
              />
            </div>
          );
        })}

        {/* Ambient bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002B66]/60 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Floating Badge Overlay */}
        <div className="absolute bottom-4 left-4 z-20 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-navy shadow-lg flex items-center gap-2 transition-all duration-300">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{slides[currentIndex].badge}</span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-navy hover:scale-110 opacity-70 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-navy hover:scale-110 opacity-70 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.tag}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
