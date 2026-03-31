'use client';

import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getBalance } from '../lib/api';
import Link from 'next/link';

interface AuthBarProps {
  onOpenModal: () => void;
}

export default function AuthBar({ onOpenModal }: AuthBarProps) {
  const { token, user, logout } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setBalance(null);
      return;
    }
    getBalance(token)
      .then((data) => setBalance(data.balanceAvailable))
      .catch(() => setBalance(null));
  }, [token]);

  if (token && user) {
    return (
      <div className="auth-bar">
        <Link
          href="/payment"
          style={{
            background: '#e3f2fd',
            color: '#1976d2',
            padding: '4px 12px',
            borderRadius: 8,
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          💳 ${balance !== null ? (balance / 100).toFixed(2) : '...'}
        </Link>
        <span>Hello, {user.name || 'User'}! ({user.role || 'USER'})</span>
        <button className="btn btn-ghost" onClick={logout}>Log Out</button>
      </div>
    );
  }

  return (
    <div className="auth-bar">
      <button className="btn" onClick={onOpenModal}>Log In</button>
    </div>
  );
}
