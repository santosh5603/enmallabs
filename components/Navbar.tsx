'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from './GlassButton';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#e6e6e6] px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-white font-extrabold text-[15px] tracking-tighter">E</span>
          <span className="font-bold text-[17px] text-black tracking-tight">Enma</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {['Features', 'Security', 'How It Works', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-[14px] font-medium text-[#31302e] hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] font-medium text-[#31302e] hover:text-black transition-colors px-4"
          >
            Log in
          </Link>
          <GlassButton
            href="/signin"
            variant="white"
            className="px-5 py-2 border-[#e6e6e6] hover:border-black/20"
          >
            Get Enma free
          </GlassButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-black/60 hover:text-black"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#f6f5f4] border-l border-[#e6e6e6] z-50 p-8 flex flex-col md:hidden"
            >
              <div className="flex justify-end mb-12">
                <button
                  className="text-black/40 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 mb-12">
                {['Home', 'Features', 'Security', 'How It Works', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href={item === 'Home' ? '/' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-xl font-medium text-[#31302e] hover:text-black transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-4 mt-auto">
                <GlassButton
                  href="/login"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Log in
                </GlassButton>
                <GlassButton
                  href="/signin"
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Enma free
                </GlassButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
