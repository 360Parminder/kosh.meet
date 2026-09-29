"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/room/')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl text-white mt-24 border-t border-white/10">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 py-7 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        {/* Left: Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
          <img src="/logo.png" alt="Kosh Meet Logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-semibold text-[17px] tracking-tight group-hover:text-orange-400 transition-colors">
            Kosh Meet
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-7 md:gap-10 text-[14px] text-[#a1a1aa]">
          <Link href="#about" className="hover:text-white transition-colors no-underline">
            About
          </Link>
          <Link href="#features" className="hover:text-white transition-colors no-underline">
            Features
          </Link>
          <Link href="#services" className="hover:text-white transition-colors no-underline">
            Services
          </Link>
          <Link href="#contact" className="hover:text-white transition-colors no-underline">
            Contacts
          </Link>
        </nav>

        {/* Right: Social Media Icons (Twitter/X, LinkedIn, Google) */}
        <div className="flex items-center gap-5 text-white shrink-0">
          {/* Twitter / X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-white hover:text-orange-400 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white hover:text-orange-400 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 5.8a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
            </svg>
          </a>

          {/* Google */}
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google"
            className="text-white hover:text-orange-400 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
