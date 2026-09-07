'use client';

import { useState } from 'react';
import Nav from './components/Nav';
import AgentWorkspace from './components/AgentWorkspace';
import PlaceholderView from './components/PlaceholderView';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

// Demo config — will be replaced by client config loaded from repo
const DEMO_CONFIG = {
  userName: 'Alex Rivera',
  clientName: 'Acme Co.',
  role: 'content_owner' as Role,
  domains: ['Marketing', 'Product', 'Legal'],
};

export default function Home() {
  const [activeView, setActiveView] = useState('agent');
  const [role] = useState<Role>(DEMO_CONFIG.role);

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return (
          <AgentWorkspace
            userName={DEMO_CONFIG.userName}
            clientName={DEMO_CONFIG.clientName}
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
        userName={DEMO_CONFIG.userName}
        activeDomains={DEMO_CONFIG.domains}
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
