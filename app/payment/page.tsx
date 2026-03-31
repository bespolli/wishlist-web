'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createCheckoutSession, getBalance, getTransactions } from '../../lib/api';

interface Balance {
  balanceAvailable: number;
  balancePending: number;
  balanceTotal: number;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function PaymentPage() {
  const { token } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  async function loadData() {
    try {
      const [bal, txs] = await Promise.all([
        getBalance(token),
        getTransactions(token),
      ]);
      setBalance(bal);
      setTransactions(txs);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCheckout() {
    setError('');
    const cents = Math.round(parseFloat(amount) * 100);

    if (isNaN(cents) || cents < 100) {
      setError('Minimum amount is $1.00');
      return;
    }

    setLoading(true);
    try {
      const data = await createCheckoutSession(token, cents);
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please log in to access payments</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>💳 Payment</h1>

      {/* Balance Card */}
      {balance && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e0e0e0',
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Your Balance</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Available</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2e7d32' }}>
                ${(balance.balanceAvailable / 100).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Pending</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f57c00' }}>
                ${(balance.balancePending / 100).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Total</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                ${(balance.balanceTotal / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-Up Form */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Top Up Balance</h3>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[5, 10, 25, 50].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(String(val))}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                border: amount === String(val) ? '2px solid #1976d2' : '1px solid #ccc',
                background: amount === String(val) ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ${val}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount in USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
            }}
          />
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              border: 'none',
              background: loading ? '#ccc' : '#1976d2',
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Pay'}
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '0.5rem', fontSize: 14 }}>
            {error}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#666' }}>No transactions yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Date</th>
                <th style={{ padding: '0.5rem' }}>Amount</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.5rem' }}>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    ${(tx.amount / 100).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      background:
                        tx.status === 'COMPLETED' ? '#e8f5e9' :
                        tx.status === 'PENDING' ? '#fff3e0' : '#ffebee',
                      color:
                        tx.status === 'COMPLETED' ? '#2e7d32' :
                        tx.status === 'PENDING' ? '#f57c00' : '#c62828',
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
