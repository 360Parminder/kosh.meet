import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Kosh Meet | Video Meetings Made Simple',
  description: 'Kosh Meet — a beautifully designed, blazing fast video meeting platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} relative min-h-screen text-white antialiased`}>
        {/* Full-Page Film Grain Texture Overlay */}
        <svg
          className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-35 mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="global-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#global-grain)" />
        </svg>

        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
