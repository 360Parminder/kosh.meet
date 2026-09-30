"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kosh_meet_user');
      if (savedUser) {
        try {
          JSON.parse(savedUser);
          router.push('/dashboard');
        } catch (e) {
          // invalid JSON, ignore
        }
      }
    }
  }, [router]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Subtle top ambient shading, completely transparent at bottom for unbroken flow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md leading-[1.15]"
          >
            Meetings Made <span className="text-white drop-shadow-lg">Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-normal drop-shadow-sm"
          >
            Crystal-clear video, seamless collaboration, and zero friction. Kosh Meet brings your team together, wherever they are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="bg-white text-neutral-950 font-semibold px-8 py-3.5 rounded-full hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all shadow-lg text-base no-underline cursor-pointer"
            >
              Sign In
            </Link>
            <a
              href="#features"
              className="bg-black/30 hover:bg-black/50 text-white font-medium px-8 py-3.5 rounded-full border border-white/25 backdrop-blur-md hover:scale-105 active:scale-95 transition-all text-base no-underline cursor-pointer"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <div className="container mx-auto px-6">
        <section id="features" className="features py-24">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }} className="font-bold">
              Why Choose Kosh Meet?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Everything you need to connect, collaborate, and ship faster.
            </p>
          </div>

          <div className="features-grid">
            <div className="glass-panel">
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Lightning Fast</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Ultra-low latency audio and video streams powered by next-generation WebRTC infrastructure.
              </p>
            </div>
            <div className="glass-panel">
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Beautiful UI</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Crafted with meticulous attention to detail, offering an immersive, distraction-free meeting experience.
              </p>
            </div>
            <div className="glass-panel">
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Secure by Default</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                End-to-end encrypted rooms, token-based room access, and enterprise-grade privacy protection.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
