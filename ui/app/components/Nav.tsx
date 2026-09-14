'use client';

import { useState } from 'react';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface NavProps {
  role: Role;
  userName: string;
  activeDomains?: string[];
  activeView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

// Simple outline SVG icons
function Icon({ id }: { id: string }) {
  const size = 15;
  const stroke = 'currentColor';
  const props = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, flexShrink: 0 };

  switch (id) {
    case 'agent':
      // Chat bubble
      return <svg {...props}><path d="M2 2.5h12a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H9l-3 3v-3H2a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" /></svg>;
    case 'requests':
      // Inbox tray
      return <svg {...props}><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" /><path d="M1.5 10h3.75l1 2h3.5l1-2H14.5" /></svg>;
    case 'outgoing':
      // Arrow up-right from box
      return <svg {...props}><path d="M6.5 2.5h-4a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-4" /><path d="M9.5 1.5h5v5" /><path d="M14.5 1.5 8 8" /></svg>;
    case 'logs':
      // List lines
      return <svg {...props}><path d="M3 4h10M3 8h10M3 12h6" /></svg>;
    case 'domains':
      // Layered circles / hierarchy
      return <svg {...props}><circle cx="8" cy="4" r="2" /><circle cx="3.5" cy="12" r="2" /><circle cx="12.5" cy="12" r="2" /><path d="M8 6v2.5M8 8.5l-4.5 2M8 8.5l4.5 2" /></svg>;
    case 'admin':
      // Sliders / settings
      return <svg {...props}><path d="M2 5h12M2 11h12" /><circle cx="5" cy="5" r="1.5" /><circle cx="11" cy="11" r="1.5" /></svg>;
    default:
      return null;
  }
}

export default function Nav({ role, userName, activeDomains = [], activeView, onViewChange, onSignOut }: NavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: 'agent',    label: 'Agent',             roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'requests', label: 'Requests',          roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'outgoing', label: 'Outgoing requests', roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'logs',     label: 'Logs',              roles: ['domain_owner', 'content_owner'] },
    { id: 'domains',  label: 'Domains',           roles: ['domain_owner', 'content_owner'] },
    { id: 'admin',    label: 'Admin',             roles: ['content_owner'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  const roleLabel = {
    contributor:   'Contributor',
    domain_owner:  'Domain owner',
    content_owner: 'Content owner',
  }[role];

  return (
    <nav style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: '#EAE5D8',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid #D6D0C4',
    }}>
      {/* Wordmark */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid #D6D0C4',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--ink)',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          Content<br />Systems
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '12px 8px' }}>
        {visibleItems.map(item => {
          const isActive = activeView === item.id;
          const isHovered = hoveredItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                marginBottom: '1px',
                background: isActive ? '#FFFFFF' : isHovered ? 'rgba(255,255,255,0.5)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: isActive ? 'var(--ink)' : 'var(--text-muted)',
                fontSize: '13.5px',
                fontFamily: 'var(--font-ui)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'background 0.12s ease, color 0.12s ease',
              }}
            >
              <Icon id={item.id} />
              {item.label}
            </button>
          );
        })}

        {/* Domain labels */}
        {(role === 'domain_owner' || role === 'content_owner') && activeDomains.length > 0 && (
          <div style={{ marginTop: '20px', padding: '0 12px' }}>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginBottom: '6px',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              Domains
            </div>
            {activeDomains.map(domain => (
              <div key={domain} style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                padding: '3px 0',
              }}>
                {domain}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #D6D0C4',
      }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--ink)',
          fontWeight: 600,
          marginBottom: '2px',
        }}>
          {userName}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '10px',
        }}>
          {roleLabel}
        </div>
        <button
          onClick={onSignOut}
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
