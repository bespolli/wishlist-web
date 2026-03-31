'use client';

import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div style={{
      maxWidth: 500,
      margin: '4rem auto',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1>Payment Successful!</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Your balance has been topped up. It may take a few moments to reflect.
      </p>
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
        Back to Payments
      </Link>
    </div>
  );
}
