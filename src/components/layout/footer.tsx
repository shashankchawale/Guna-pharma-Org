'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe2, MessageCircle, Send, Video, Mail, Phone, MapPin, Truck, Shield, Star, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandConfig } from '@/lib/config';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/catalog' },
    { label: 'Skincare & Cosmetics', href: '/catalog?category=skincare' },
    { label: 'Medicines & Wellness', href: '/catalog?category=medicines' },
    { label: 'Vitamins & Supplements', href: '/catalog?category=vitamins' },
    { label: 'Best Sellers', href: '/catalog?sort=popular' },
    { label: 'New Arrivals', href: '/catalog?sort=newest' },
    { label: 'Offers & Deals', href: '/offers' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Return & Refund Policy', href: '/refund-policy' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Blog', href: '/blog' },
    { label: 'Affiliate Program', href: '/affiliate' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Medical Disclaimer', href: '/medical-disclaimer' },
    { label: 'Licenses & Certifications', href: '/licenses' },
  ],
};

const trustBadges = [
  { icon: Shield, label: '100% Genuine Products', desc: 'Authenticity guaranteed' },
  { icon: Truck, label: 'Fast Delivery', desc: '2-4 business days' },
  { icon: Star, label: 'Secure Payments', desc: 'Razorpay protected' },
  { icon: Headphones, label: 'Pharmacist Support', desc: 'Expert advice available' },
];

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
  };

  return (
    <footer className="border-t border-[#0C3078] bg-gradient-to-b from-[#0A2660] via-[#071D4A] to-[#041230] text-white" role="contentinfo">
      {/* Trust Badges */}
      <div className="border-b border-white/10 bg-white/5 py-6 md:py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{badge.label}</p>
                    <p className="text-xs text-blue-200/80">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3 group" aria-label={brandConfig.name}>
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-md ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="GUNA PHARMA"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-bold text-white text-xl tracking-tight">{brandConfig.name}</span>
              </Link>
              <p className="text-sm text-blue-100/85 max-w-xs leading-relaxed">
                {brandConfig.description}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={brandConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-blue-200 hover:bg-white hover:text-[#0A2660] hover:border-white transition-all"
                  aria-label="Facebook"
                >
                  <Globe2 className="h-5 w-5" />
                </a>
                <a
                  href={brandConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-blue-200 hover:bg-white hover:text-[#0A2660] hover:border-white transition-all"
                  aria-label="Instagram"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href={brandConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-blue-200 hover:bg-white hover:text-[#0A2660] hover:border-white transition-all"
                  aria-label="Twitter"
                >
                  <Send className="h-5 w-5" />
                </a>
                <a
                  href={brandConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-blue-200 hover:bg-white hover:text-[#0A2660] hover:border-white transition-all"
                  aria-label="YouTube"
                >
                  <Video className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <nav aria-label="Shop">
              <h3 className="font-bold text-white mb-4 text-base tracking-wide">Shop</h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="text-sm text-blue-200/85 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Help */}
            <nav aria-label="Help & Support">
              <h3 className="font-bold text-white mb-4 text-base tracking-wide">Help & Support</h3>
              <ul className="space-y-3">
                {footerLinks.help.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="text-sm text-blue-200/85 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav aria-label="Company">
              <h3 className="font-bold text-white mb-4 text-base tracking-wide">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="text-sm text-blue-200/85 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Contact & Compliance */}
      <div className="border-t border-white/10 bg-black/20 py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">Contact Us</h3>
              <address className="not-italic space-y-2 text-sm text-blue-200/85">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-300" aria-hidden="true" />
                  <span>{brandConfig.contact.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-blue-300" aria-hidden="true" />
                  <a href={`tel:${brandConfig.contact.phone}`} className="hover:text-white transition-colors">
                    {brandConfig.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-blue-300" aria-hidden="true" />
                  <a href={`mailto:${brandConfig.contact.email}`} className="hover:text-white transition-colors">
                    {brandConfig.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 6c0-2.76-2.24-5-5-5S7 3.24 7 6v10c0 2.76 2.24 5 5 5s5-2.24 5-5V6zm-5 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-9H8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v4z"/>
                    </svg>
                  </span>
                  <a href={`https://wa.me/${brandConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm font-medium">
                    WhatsApp Support
                  </a>
                </div>
              </address>
            </div>

            {/* Compliance Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">Licenses & Certifications</h3>
              <dl className="space-y-2 text-sm text-blue-200/85">
                <div className="flex items-start gap-2">
                  <dt className="font-medium text-blue-100 w-32 flex-shrink-0">Drug License:</dt>
                  <dd className="text-blue-200/75">{brandConfig.compliance.drugLicenseNumber}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="font-medium text-blue-100 w-32 flex-shrink-0">GST Number:</dt>
                  <dd className="text-blue-200/75">{brandConfig.compliance.gstNumber}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="font-medium text-blue-100 w-32 flex-shrink-0">Pharmacist:</dt>
                  <dd className="text-blue-200/75">{brandConfig.compliance.pharmacistName}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="font-medium text-blue-100 w-32 flex-shrink-0">Reg. Number:</dt>
                  <dd className="text-blue-200/75">{brandConfig.compliance.pharmacistRegistration}</dd>
                </div>
              </dl>
            </div>

            {/* Medical Disclaimer */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">Medical Disclaimer</h3>
              <p className="text-sm text-blue-200/85 leading-relaxed">
                Information provided on this website is for general awareness only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
              </p>
              <Link
                href="/medical-disclaimer"
                className="text-sm text-blue-300 hover:text-white font-medium hover:underline inline-flex items-center gap-1"
              >
                Read full disclaimer
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">Newsletter</h3>
              <p className="text-sm text-blue-200/85">
                Subscribe for health tips, exclusive offers & new arrivals
              </p>
              {newsletterSubscribed ? (
                <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 p-3 flex items-center gap-2 text-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span>Thank you! You are subscribed to updates.</span>
                </div>
              ) : (
                <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    name="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-11 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-blue-300/60 focus:bg-white focus:text-[#0A2660] focus:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  <button
                    type="submit"
                    className="flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-[#0A2660] hover:bg-blue-50 transition-colors shadow-md shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 bg-black/30">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-blue-200/75">
            <p>&copy; {new Date().getFullYear()} {brandConfig.name}. All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              <span className="text-white/20">|</span>
              <Link href="/admin/login" prefetch={true} className="text-blue-300/90 hover:text-white transition-colors font-medium">
                Admin Portal
              </Link>
            </div>
            <p className="text-xs text-blue-300/60">Made with care for your health & beauty</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
