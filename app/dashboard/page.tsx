export const metadata = {
  title: 'Dashboard | Kosh Meet',
};

export default function Dashboard() {
  return (
    <div className="container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Dashboard</h1>
      
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Welcome back, User!</h2>
        <p style={{ color: '#a1a1aa' }}>
          This is a protected dashboard area. You can start building out your application features here.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3>Statistics</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>1,024</p>
          </div>
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3>Active Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>256</p>
          </div>
        </div>
      </div>
    </div>
  );
}
