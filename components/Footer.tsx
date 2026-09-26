export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '2rem 0', textAlign: 'center', color: '#a1a1aa' }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Nexus Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
