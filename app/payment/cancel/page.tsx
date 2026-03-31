'use client';

import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div style={{
      maxWidth: 500,
      margin: '4rem auto',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1>Payment Cancelled</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Your payment was not completed. No charges were made.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          href="/payment"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: '#1976d2',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Try Again
        </Link>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: '#fff',
            color: '#333',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
            border: '1px solid #ccc',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
