'use client';

import { useAuth } from '../context/AuthContext';

// Props: function to open the auth modal
interface AuthBarProps {
  onOpenModal: () => void;
}

export default function AuthBar({ onOpenModal }: AuthBarProps) {
  // Get auth data from context
  const { token, user, logout } = useAuth();

  // If logged in: show greeting + role + logout button
  if (token && user) {
    return (
      <div className="auth-bar">
        <span>Hello, {user.name || 'User'}! ({user.role || 'USER'})</span>
        <button className="btn btn-ghost" onClick={logout}>Log Out</button>
      </div>
    );
  }

  // If not logged in: show "Log In" button
  return (
    <div className="auth-bar">
      <button className="btn" onClick={onOpenModal}>Log In</button>
    </div>
  );
}
