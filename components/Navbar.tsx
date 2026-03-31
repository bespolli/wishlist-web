'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthBar from './AuthBar';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const links = [
    { href: '/', label: '🏠 Home' },
    { href: '/payment', label: '💳 Payment' },
  ];

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 2rem',
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Left: logo + nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{
            fontSize: 20,
            fontWeight: 'bold',
            textDecoration: 'none',
            color: '#333',
          }}>
            Wishlist App
          </Link>

          <nav style={{ display: 'flex', gap: '1rem' }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: pathname === link.href ? 'bold' : 'normal',
                  background: pathname === link.href ? '#e3f2fd' : 'transparent',
                  color: pathname === link.href ? '#1976d2' : '#666',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: auth bar */}
        <AuthBar onOpenModal={() => setShowModal(true)} />
      </header>

      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
