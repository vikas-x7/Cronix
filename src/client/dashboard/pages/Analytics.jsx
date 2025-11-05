export default function Analytics() {
  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <div className="analytics-container">
        <div className="chart-section">
          <h2>Performance Metrics</h2>
          <div className="metric-box">
            <div className="metric-label">Page Views</div>
            <div className="metric-value">15,842</div>
            <div className="metric-change positive">↑ 12% from last week</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Sessions</div>
            <div className="metric-value">3,247</div>
            <div className="metric-change positive">↑ 8% from last week</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Bounce Rate</div>
            <div className="metric-value">32.5%</div>
            <div className="metric-change negative">↓ 5% from last week</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Avg. Session Duration</div>
            <div className="metric-value">3m 45s</div>
            <div className="metric-change positive">↑ 20s from last week</div>
          </div>
        </div>
        <div className="chart-section">
          <h2>Traffic Sources</h2>
          <div className="source-item">
            <span className="source-name">Direct Traffic</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '45%' }}></div>
            </div>
            <span className="source-percent">45%</span>
          </div>
          <div className="source-item">
            <span className="source-name">Search Engines</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '35%' }}></div>
            </div>
            <span className="source-percent">35%</span>
          </div>
          <div className="source-item">
            <span className="source-name">Social Media</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: '20%' }}></div>
            </div>
            <span className="source-percent">20%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
