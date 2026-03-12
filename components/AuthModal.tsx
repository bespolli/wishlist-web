'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginRequest, registerRequest } from '../lib/api';

// Props: controls whether modal is visible and how to close it
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();

  // Active tab: 'login' or 'register'
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Error message to show under the form
  const [error, setError] = useState('');

  // Handle login form submission
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const data = await loginRequest(email, password);
      login(data.accessToken, data.user);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  // Handle register form submission
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const data = await registerRequest(name, email, password);
      login(data.accessToken, data.user);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  }

  // Clear form fields and close the modal
  function resetAndClose() {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setTab('login');
    onClose();
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? 'show' : ''}`}
      onClick={(e) => {
        // Close when clicking on dark background (not on the modal itself)
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div className="modal">
        {/* Tab buttons */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Log In
          </button>
          <button
            className={`modal-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Login form */}
        {tab === 'login' && (
          <form className="modal-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">Log In</button>
            <p className="form-error">{error}</p>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form className="modal-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit" className="btn">Sign Up</button>
            <p className="form-error">{error}</p>
          </form>
        )}
      </div>
    </div>
  );
}
