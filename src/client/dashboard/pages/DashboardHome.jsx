export default function DashboardHome() {
  return (
    <div className="dashboard-home">
      <h1>Dashboard Home</h1>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">1,234</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-value">$45,678</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Growth</h3>
            <p className="stat-value">+12.5%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Tasks Complete</h3>
            <p className="stat-value">89%</p>
          </div>
        </div>
      </div>
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <p>Your dashboard is ready to use. Start exploring your data!</p>
      </div>
    </div>
  );
}
