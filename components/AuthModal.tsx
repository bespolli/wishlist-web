'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginRequest, registerRequest, googleLoginRequest } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Track if Google script is already loaded
  const googleLoaded = useRef(false);

  // ===== GOOGLE SIGN-IN: load script ONCE =====
  useEffect(() => {
    if (!isOpen) return;
    if (googleLoaded.current) {
      // Script already loaded — just render button
      renderGoogleButton();
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('GOOGLE CLIENT ID:', clientId);

    if (!clientId) return;

    // Check if script already exists in DOM
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      googleLoaded.current = true;
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      googleLoaded.current = true;
      renderGoogleButton();
    };
    document.body.appendChild(script);
    // Don't remove script on cleanup — keep it loaded
  }, [isOpen]);

  // ===== Re-render button when tab changes =====
  useEffect(() => {
    if (!isOpen || !googleLoaded.current) return;
    // Small delay to let React render the new tab's DOM
    const timer = setTimeout(() => renderGoogleButton(), 50);
    return () => clearTimeout(timer);
  }, [tab]);

  function renderGoogleButton() {
    const container = document.getElementById('google-btn');
    if (container) {
      container.innerHTML = '';
      window.google?.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
        locale: 'en',
      });
    }
  }

  async function handleGoogleResponse(response: any) {
    setError('');
    setLoading(true);
    try {
      const data = await googleLoginRequest(response.credential);
      login(data.accessToken, data.user);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      login(data.accessToken, data.user);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerRequest(name, email, password);
      login(data.accessToken, data.user);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  function resetAndClose() {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setTab('login');
    onClose();
    setLoading(false);
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? 'show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div className="modal">
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

        {tab === 'login' && (
          <form className="modal-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? '⏳ Connecting to server...' : 'Log In'}
            </button>
            <div className="google-divider">or</div>
            <div id="google-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>
            <p className="form-error">{error}</p>
          </form>
        )}

        {tab === 'register' && (
          <form className="modal-form" onSubmit={handleRegister}>
            <input type="text" placeholder="Name" value={name}
              onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password (min 6 chars)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? '⏳ Connecting to server...' : 'Sign Up'}
            </button>
            <div className="google-divider">or</div>
            <div id="google-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>
            <p className="form-error">{error}</p>
          </form>
        )}
      </div>
    </div>
  );
}
