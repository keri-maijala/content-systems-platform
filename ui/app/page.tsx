'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from './components/Nav';
import AgentWorkspace from './components/AgentWorkspace';
import PlaceholderView from './components/PlaceholderView';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface ClientConfig {
  clientKey: string;
  clientName: string;
  domains: string[];
  user: {
    name: string;
    email: string;
    role: Role;
  } | null;
}

export default function Home() {
  const searchParams = useSearchParams();
  const clientKey = searchParams.get('client') || 'demo';

  const [activeView, setActiveView] = useState('agent');
  const [config, setConfig] = useState<ClientConfig | null>(null);

  useEffect(() => {
    fetch(`/api/client?client=${clientKey}`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => setConfig(null));
  }, [clientKey]);

  const role: Role = config?.user?.role || 'contributor';
  const userName = config?.user?.name || '…';
  const clientName = config?.clientName || '…';
  const domains = config?.domains || [];

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return (
          <AgentWorkspace
            userName={userName}
            clientName={clientName}
            clientKey={clientKey}
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
