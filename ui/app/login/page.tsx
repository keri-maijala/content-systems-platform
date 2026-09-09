'use client';

import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientKey, setClientKey] = useState('demo');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setClientKey(params.get('client') || 'demo');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, clientKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        setLoading(false);
        return;
      }

      window.location.href = `/?client=${clientKey}`;
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        padding: '0 24px',
      }}>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--navy)',
          marginBottom: '40px',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          Content<br />Systems
        </div>

        <h1 style={{
          fontSize: '22px',
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 600,
          color: '#1A1A2E',
          marginBottom: '8px',
          letterSpacing: '-0.01em',
        }}>
          Sign in
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '32px',
          lineHeight: 1.5,
        }}>
          Use the credentials set up for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '6px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#111827',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '6px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#111827',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: '13px',
              color: '#DC2626',
              marginBottom: '16px',
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              borderRadius: '6px',
              border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, system-ui, sans-serif',
              backgroundColor: loading ? '#9CA3AF' : 'var(--navy)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
