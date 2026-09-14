'use client';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface NavProps {
  role: Role;
  userName: string;
  activeDomains?: string[];
  activeView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

export default function Nav({ role, userName, activeDomains = [], activeView, onViewChange, onSignOut }: NavProps) {
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
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 16px',
                marginBottom: '1px',
                background: isActive ? '#FFFFFF' : 'transparent',
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
              {item.label}
            </button>
          );
        })}

        {/* Domain labels */}
        {(role === 'domain_owner' || role === 'content_owner') && activeDomains.length > 0 && (
          <div style={{ marginTop: '20px', padding: '0 16px' }}>
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
        padding: '16px 24px',
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
