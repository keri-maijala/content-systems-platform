'use client';

import { useState } from 'react';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface NavProps {
  role: Role;
  userName: string;
  activeDomains?: string[];
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Nav({ role, userName, activeDomains = [], activeView, onViewChange }: NavProps) {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { id: 'agent', label: 'Agent', roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'requests', label: 'Requests', roles: ['domain_owner', 'content_owner'] },
    { id: 'logs', label: 'Logs', roles: ['domain_owner', 'content_owner'] },
    { id: 'domains', label: 'Domains', roles: ['domain_owner', 'content_owner'] },
    { id: 'admin', label: 'Admin', roles: ['content_owner'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  const roleLabel = {
    contributor: 'Contributor',
    domain_owner: 'Domain owner',
    content_owner: 'Content owner',
  }[role];

  return (
    <nav style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: 'var(--navy)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
    }}>
      {/* Wordmark */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--white)',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          Content<br />Systems
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '16px 0' }}>
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 24px',
              background: activeView === item.id ? 'rgba(74, 111, 165, 0.25)' : 'transparent',
              border: 'none',
              borderLeft: activeView === item.id ? '2px solid var(--blue)' : '2px solid transparent',
              color: activeView === item.id ? 'var(--white)' : 'rgba(255,255,255,0.55)',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: activeView === item.id ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0',
            }}
          >
            {item.label}
          </button>
        ))}

        {/* Domain list for domain owners */}
        {(role === 'domain_owner' || role === 'content_owner') && activeDomains.length > 0 && (
          <div style={{ marginTop: '24px', padding: '0 24px' }}>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 500,
              marginBottom: '8px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Your domains
            </div>
            {activeDomains.map(domain => (
              <div key={domain} style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                padding: '4px 0',
              }}>
                {domain}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User identity */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--white)',
          fontWeight: 500,
          marginBottom: '2px',
        }}>
          {userName}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {roleLabel}
        </div>
      </div>
    </nav>
  );
}
