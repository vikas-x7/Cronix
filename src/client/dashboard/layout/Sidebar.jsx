import React from 'react';
import Link from 'next/link';
import '../styles/dashboard.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/dashboard">
              <span className="nav-icon">📊</span>
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile">
              <span className="nav-icon">👤</span>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics">
              <span className="nav-icon">📈</span>
              Analytics
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <span className="nav-icon">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
