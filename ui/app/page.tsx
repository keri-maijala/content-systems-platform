'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from './components/Nav';
import AgentWorkspace from './components/AgentWorkspace';
import PlaceholderView from './components/PlaceholderView';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface UserContext {
  name: string;
  email: string;
  role: Role;
  domains: string[];
}

interface ClientConfig {
  clientKey: string;
  clientName: string;
  domains: string[];
  user: UserContext | null;
}

function AppShell() {
  const searchParams = useSearchParams();
  const clientKey = searchParams.get('client') || 'demo';

  const [activeView, setActiveView] = useState('agent');
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setConfig(null);
    setLoading(true);
    fetch(`/api/client?client=${clientKey}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [clientKey]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <p style={{ fontSize: '14px', color: '#9CA3AF', letterSpacing: '0.02em' }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <h1 style={{
          fontSize: '22px',
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 600,
          color: '#1A1A2E',
          marginBottom: '12px',
        }}>
          Client not found
        </h1>
        <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
          No configuration exists for <strong>{clientKey}</strong>. Check the URL and try again.
        </p>
      </div>
    );
  }

  const user = config?.user ?? null;
  const role: Role = user?.role || 'contributor';
  const userName = user?.name || '';
  const clientName = config?.clientName || '';
  const domains = config?.domains || [];

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return (
          <AgentWorkspace
            userName={userName}
            clientName={clientName}
            clientKey={clientKey}
            user={user}
          />
        );
      case 'requests':
        return (
          <PlaceholderView
            title="Requests"
            description="Open requests from your domains appear here — governance conflicts, direct content requests, and items pending resolution. This view is coming in a future build."
          />
        );
      case 'logs':
        return (
          <PlaceholderView
            title="Logs"
            description="Your domain logs — informational items, actionable requests, and override history. Filter by domain, date, or status. This view is coming in a future build."
          />
        );
      case 'domains':
        return (
          <PlaceholderView
            title="Domains"
            description="Domain configuration — owners, stakeholders, routing, and override permissions. This view is coming in a future build."
          />
        );
      case 'admin':
        return (
          <PlaceholderView
            title="Admin"
            description="Platform configuration — users, roles, digest settings, and voice and tone. This view is coming in a future build."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
    }}>
      <Nav
        role={role}
        userName={userName}
        activeDomains={domains}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {renderView()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <p style={{ fontSize: '14px', color: '#9CA3AF', letterSpacing: '0.02em' }}>Loading…</p>
      </div>
    }>
      <AppShell />
    </Suspense>
  );
}

