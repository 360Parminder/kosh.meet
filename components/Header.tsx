"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  if (
    pathname?.startsWith('/room/') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/login')
  ) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Thin full-width top bezel */}
      <div className="w-full h-[8px] bg-[#0a0a0a]" />

      {/* Island row */}
      <div className="flex items-start justify-center">
        {/* Left concave ear */}
        <div
          className="w-[30px] h-[30px] shrink-0"
          style={{
            background:
              'radial-gradient(circle at 0% 100%, transparent 29.5px, #0a0a0a 30px)',
          }}
        />

        {/* The Island */}
        <motion.header
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="bg-[#0a0a0a] h-[60px] w-full max-w-[750px] flex items-center justify-between px-5 rounded-b-[22px]"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="#features" className="text-[#a1a1aa] hover:text-white transition-colors text-[15px] font-medium no-underline">Features</Link>
            <Link href="#faq" className="text-[#a1a1aa] hover:text-white transition-colors text-[15px] font-medium no-underline">FAQ</Link>
            <Link href="#pricing" className="text-[#a1a1aa] hover:text-white transition-colors text-[15px] font-medium no-underline">Pricing</Link>
          </nav>

          {/* Sign In button */}
          <Link
            href="/login"
            className="bg-white text-black px-5 py-2 rounded-[14px] font-semibold text-[14px] flex items-center gap-2 hover:bg-gray-100 transition-colors no-underline"
          >
            Sign In
          </Link>
        </motion.header>

        {/* Right concave ear */}
        <div
          className="w-[30px] h-[30px] shrink-0"
          style={{
            background:
              'radial-gradient(circle at 100% 100%, transparent 29.5px, #0a0a0a 30px)',
          }}
        />
      </div>
    </div>
  );
}
