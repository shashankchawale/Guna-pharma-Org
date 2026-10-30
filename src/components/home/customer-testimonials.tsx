'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, CheckCircle2, ThumbsUp, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: string;
  rating: number;
  title: string;
  quote: string;
  author: string;
  location: string;
  countryCode: string;
  initials: string;
  date: string;
  product: string;
  helpfulCount: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    title: 'Professional packaging & prompt international arrival',
    quote:
      'Ordering prescription medication internationally was nerve-wracking initially, but GUNA PHARMA made the entire process seamless. The pharmacist verified my prescription promptly and the parcel reached London within 5 business days in temperature-secure packaging.',
    author: 'Amelia Hartman',
    location: 'London, United Kingdom',
    countryCode: '🇬🇧',
    initials: 'AH',
    date: 'Verified order · 2 weeks ago',
    product: 'Prescription & Healthcare Supply',
    helpfulCount: 38,
  },
  {
    id: '2',
    rating: 5,
    title: 'Authentic ayurvedic & dermatological essentials',
    quote:
      'I order both Himalaya wellness supplements and specialized skincare creams. Finding genuine batches with valid batch barcodes used to be difficult abroad. GUNA PHARMA provides authenticated manufacturer products with full batch documentation.',
    author: 'Carlos Mendes',
    location: 'Toronto, Canada',
    countryCode: '🇨🇦',
    initials: 'CM',
    date: 'Verified order · 1 month ago',
    product: 'Himalaya Wellness & Derma Essentials',
    helpfulCount: 29,
  },
  {
    id: '3',
    rating: 5,
    title: 'Outstanding customer care and live order tracking',
    quote:
      'First-class customer service. When I had a query regarding dosage instructions and customs clearance, the pharmacist team responded within minutes on WhatsApp. Delivery to Sydney was tracked end-to-end without a single hitch.',
    author: 'Priya Nair',
    location: 'Sydney, Australia',
    countryCode: '🇦🇺',
    initials: 'PN',
    date: 'Verified order · 3 weeks ago',
    product: 'Daily Wellness & Nutrition Support',
    helpfulCount: 44,
  },
  {
    id: '4',
    rating: 5,
    title: 'Uncompromising quality and fair international pricing',
    quote:
      'The pricing is completely transparent without hidden export markups. Everything arrived sealed in tamper-proof bubble insulation. My German clinic colleagues now also source their wellness products through GUNA PHARMA.',
    author: 'Elena Mueller',
    location: 'Munich, Germany',
    countryCode: '🇩🇪',
    initials: 'EM',
    date: 'Verified order · 3 weeks ago',
    product: 'Clinical Skincare & Herbal Formulations',
    helpfulCount: 21,
  },
  {
    id: '5',
    rating: 5,
    title: 'Fast delivery to UAE with courteous coordination',
    quote:
      'Prompt responses and smooth customs handling for Dubai delivery. The parcel cleared airport inspection effortlessly thanks to clear paperwork and invoice declarations attached to the exterior pouch.',
    author: 'Rajesh Joshi',
    location: 'Dubai, United Arab Emirates',
    countryCode: '🇦🇪',
    initials: 'RJ',
    date: 'Verified order · 4 days ago',
    product: 'Bulk Healthcare & Family Supplies',
    helpfulCount: 35,
  },
  {
    id: '6',
    rating: 5,
    title: 'Genuine skincare products and long expiration dates',
    quote:
      'All cosmetic products arrived with over 2 years of remaining shelf life and pristine holographic safety seals. Truly appreciate the attention to customer satisfaction and prompt email notifications.',
    author: 'Sophie Dubois',
    location: 'Paris, France',
    countryCode: '🇫🇷',
    initials: 'SD',
    date: 'Verified order · 1 week ago',
    product: 'Dermatological Cleansers & Serums',
    helpfulCount: 19,
  },
];

export function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
  const [touchEndX, setTouchEndX] = React.useState<number | null>(null);
  const [helpfulLiked, setHelpfulLiked] = React.useState<Record<string, boolean>>({});

  const total = testimonials.length;

  const prev = React.useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  }, [total]);

  const next = React.useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  }, [total]);

  // Touch event handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45; // pixels
    if (distance > minSwipeDistance) {
      // Swiped left -> next
      next();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      prev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Toggle helpful like count
  const toggleHelpful = (id: string) => {
    setHelpfulLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Desktop visible items (3 items centered around currentIndex)
  const desktopVisibleItems = [
    testimonials[currentIndex % total],
    testimonials[(currentIndex + 1) % total],
    testimonials[(currentIndex + 2) % total],
  ];

  const currentMobileItem = testimonials[currentIndex];

  return (
    <section className="relative overflow-hidden bg-slate-50/70 py-12 sm:py-16 md:py-20 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0066E8] border border-blue-100/80">
            <ShieldCheck className="h-4 w-4 text-[#0066E8]" />
            Verified Customer Reviews
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
            Trusted by Patients & Healthcare Buyers Worldwide
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real experiences from individuals, clinics, and pharmacies sourcing authentic medicines and skincare globally.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-2xl bg-white px-4 py-2.5 shadow-xs border border-gray-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-extrabold text-navy text-sm">4.9 / 5.0 Rating</span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">1,240+ verified international orders</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE VIEW (< md): 1 Card with Touch Swipe, Clear Controls   */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-8 block md:hidden">
          {/* Swipe container with Touch listeners */}
          <div
            className="touch-pan-y relative select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMobileItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="relative rounded-2xl border border-blue-100/80 bg-white p-5 sm:p-6 shadow-md"
              >
                {/* Header of the Mobile Card: Stars, Verified Badge & Counter */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3.5">
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < currentMobileItem.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-transparent text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Verified Patient / Buyer
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
                    {currentIndex + 1} of {total}
                  </span>
                </div>

                {/* Review Headline & Quote */}
                <div className="mt-3.5">
                  <h3 className="text-sm font-bold text-navy leading-snug">
                    {currentMobileItem.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
                    &ldquo;{currentMobileItem.quote}&rdquo;
                  </p>

                  <div className="mt-3 rounded-xl bg-blue-50/50 px-2.5 py-1 text-[11px] font-medium text-[#005AD2] inline-block border border-blue-100/50">
                    📦 {currentMobileItem.product}
                  </div>
                </div>

                {/* Footer: Author Info & Helpful Counter */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-xs text-[#005AD2]">
                      {currentMobileItem.initials}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-xs sm:text-sm flex items-center gap-1">
                        {currentMobileItem.author}
                        <span className="text-sm" title={currentMobileItem.location}>
                          {currentMobileItem.countryCode}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-500">{currentMobileItem.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHelpful(currentMobileItem.id)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                      helpfulLiked[currentMobileItem.id]
                        ? 'bg-blue-50 text-primary font-bold'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label="Mark review as helpful"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>
                      {currentMobileItem.helpfulCount + (helpfulLiked[currentMobileItem.id] ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Navigation Controls: Clean, Non-overlapping buttons + Dots */}
          <div className="mt-5 flex items-center justify-between px-1">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs active:bg-gray-100 active:scale-95 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentIndex(dotIndex)}
                  aria-label={`Go to review ${dotIndex + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIndex === currentIndex
                      ? 'w-6 bg-[#0066E8]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs active:bg-gray-100 active:scale-95 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-gray-400">
            Swipe left or right to explore more patient experiences
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP VIEW (>= md): 3 Cards with Center Elevation & Arrows */}
        {/* ------------------------------------------------------------- */}
        <div className="relative mt-12 hidden md:block">
          {/* Arrow Buttons - cleanly outside the cards on desktop */}
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:text-navy hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={next}
            aria-label="Next testimonials"
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:text-navy hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch px-4">
            {desktopVisibleItems.map((item, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`relative flex flex-col justify-between rounded-3xl border bg-white p-7 transition-all duration-300 ${
                    isCenter
                      ? 'border-blue-200 shadow-xl -translate-y-2 ring-1 ring-blue-100'
                      : 'border-border shadow-card hover:shadow-lg'
                  }`}
                >
                  {/* Decorative Quote Mark Watermark */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-4 select-none font-serif text-6xl font-bold leading-none text-blue-100/50"
                  >
                    &rdquo;
                  </div>

                  <div>
                    {/* Stars and Verified Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-transparent text-amber-400'
                            }`}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    {/* Headline and Quote */}
                    <h3 className="mt-4 text-sm font-bold text-navy leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    <p className="mt-3 text-xs text-blue-700 font-medium">
                      📦 {item.product}
                    </p>
                  </div>

                  {/* Author / Identity & Helpful button */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-sm text-[#005AD2]">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm flex items-center gap-1">
                          {item.author}
                          <span className="text-sm" title={item.location}>
                            {item.countryCode}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleHelpful(item.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        helpfulLiked[item.id]
                          ? 'bg-blue-50 text-primary font-bold'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      aria-label="Mark review as helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{item.helpfulCount + (helpfulLiked[item.id] ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center items-center gap-2">
            {testimonials.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIndex === currentIndex
                    ? 'w-8 bg-[#0066E8]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Link to Share Experience */}
        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Share your experience or submit a verified review <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
