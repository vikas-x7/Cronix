export default function Settings() {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-section">
          <h2>Account Settings</h2>
          <div className="setting-item">
            <label>Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Push Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Marketing Emails</label>
            <input type="checkbox" />
          </div>
        </div>
        <div className="settings-section">
          <h2>Privacy Settings</h2>
          <div className="setting-item">
            <label>Profile Visibility</label>
            <select defaultValue="public">
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Data Collection</label>
            <select defaultValue="minimal">
              <option value="minimal">Minimal</option>
              <option value="standard">Standard</option>
              <option value="full">Full</option>
            </select>
          </div>
        </div>
        <div className="settings-section">
          <h2>Security</h2>
          <div className="setting-item">
            <button className="btn-secondary">Change Password</button>
          </div>
          <div className="setting-item">
            <button className="btn-secondary">Enable Two-Factor Authentication</button>
          </div>
          <div className="setting-item">
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
