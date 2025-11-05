export default function Profile() {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2>John Doe</h2>
            <p>john.doe@example.com</p>
            <p className="profile-role">Admin User</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-field">
              <label>Full Name:</label>
              <span>John Doe</span>
            </div>
            <div className="detail-field">
              <label>Email:</label>
              <span>john.doe@example.com</span>
            </div>
            <div className="detail-field">
              <label>Phone:</label>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <div className="detail-section">
            <h3>Account Settings</h3>
            <div className="detail-field">
              <label>Member Since:</label>
              <span>January 2024</span>
            </div>
            <div className="detail-field">
              <label>Status:</label>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
