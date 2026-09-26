import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">
          Build the <span className="gradient-text">Future</span> Today
        </h1>
        <p className="hero-subtitle">
          Experience a blazing fast, beautifully designed modern web platform that scales with your ambition.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn-primary">
            Get Started
          </Link>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="features">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Us?</h2>
          <p style={{ color: '#a1a1aa' }}>Everything you need to ship faster and better.</p>
        </div>
        
        <div className="features-grid">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Lightning Fast</h3>
            <p style={{ color: '#a1a1aa' }}>Optimized for speed and performance, ensuring your users never have to wait.</p>
          </div>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Beautiful UI</h3>
            <p style={{ color: '#a1a1aa' }}>Crafted with attention to every pixel, providing an immersive experience.</p>
          </div>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Secure by Default</h3>
            <p style={{ color: '#a1a1aa' }}>Enterprise-grade security built into the core, protecting you and your users.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
