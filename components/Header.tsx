import Link from 'next/link';

export default function Header() {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link href="/" className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
          Nexus
        </Link>
        <nav className="nav-links">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="#" className="nav-link">Features</Link>
          <Link href="#" className="nav-link">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}
