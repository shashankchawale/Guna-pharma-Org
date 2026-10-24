'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  author: string;
  location: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    quote:
      'Ordering was straightforward and the whole process felt professional from start to finish. My medication arrived well packaged and right on schedule.',
    author: 'Amelia Hartman',
    location: 'United Kingdom',
    initials: 'AH',
  },
  {
    id: '2',
    rating: 4,
    quote:
      'Good selection of products and clear information on every listing. Customer support answered my questions quickly before I placed my order.',
    author: 'Carlos Mendes',
    location: 'Canada',
    initials: 'CM',
  },
  {
    id: '3',
    rating: 5,
    quote:
      'This was my first time ordering medicine online internationally and I was a bit nervous, but everything went smoothly and the pricing was fair.',
    author: 'Priya Nair',
    location: 'Australia',
    initials: 'PN',
  },
  {
    id: '4',
    rating: 5,
    quote:
      'Excellent quality skincare and genuine medicines delivered with complete care. Finding a reliable international pharmacy has never been this easy.',
    author: 'Elena Mueller',
    location: 'Germany',
    initials: 'EM',
  },
  {
    id: '5',
    rating: 5,
    quote:
      'Prompt responses on WhatsApp and seamless order tracking. Highly recommend GUNA PHARMA for both personal and bulk healthcare orders.',
    author: 'Rajesh Joshi',
    location: 'United Arab Emirates',
    initials: 'RJ',
  },
];

export function CustomerTestimonials() {
  const [startIndex, setStartIndex] = React.useState(0);

  const prev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Get 3 consecutive items (wrapping around)
  const visibleItems = [
    testimonials[startIndex % testimonials.length],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066E8]">
            CUSTOMER EXPERIENCES
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
            Trusted by People Who Care About Their Health
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            A simple, reliable healthcare experience designed around the people we serve.
          </p>
          <div className="mt-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              Share your experience <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-12">
          {/* Arrow Buttons */}
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:text-navy hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            aria-label="Next testimonials"
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:text-navy hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch px-2 sm:px-4">
            {visibleItems.map((item, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col justify-between rounded-3xl border bg-white p-7 sm:p-8 transition-all duration-300 ${
                    isCenter
                      ? 'border-blue-200 shadow-xl md:-translate-y-2 ring-1 ring-blue-100'
                      : 'border-border shadow-card hover:shadow-lg'
                  }`}
                >
                  {/* Decorative Quote Mark Watermark */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-4 select-none font-serif text-7xl font-bold leading-none text-blue-100/70"
                  >
                    &rdquo;
                  </div>

                  <div>
                    {/* Stars */}
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

                    {/* Quote text */}
                    <p className="mt-5 text-sm sm:text-base leading-relaxed text-gray-700">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author / Identity */}
                  <div className="mt-8 flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-sm text-[#005AD2]">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm sm:text-base">{item.author}</p>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
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
                onClick={() => setStartIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIndex === startIndex % testimonials.length
                    ? 'w-6 bg-[#0066E8]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
