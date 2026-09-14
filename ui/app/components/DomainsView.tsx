'use client';

import { useState } from 'react';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface Stakeholder {
  email: string;
  relationship: string;
}

interface OverrideFlagging {
  enabled: boolean;
  threshold_per_item: number;
  threshold_per_area: number;
  notify: string[];
}

interface RoutingRule {
  owner: string;
  log: string;
  notify: string[];
}

interface DesignatePermissions {
  can_override_governance: boolean;
  can_resolve_requests: boolean;
  can_view_logs: boolean;
}

interface DesignateApproval {
  status: 'approved' | 'pending';
  approved_by: string | null;
  approved_at: string | null;
}

interface Designate {
  user_id: string;
  type: 'standing' | 'temporary';
  active_from?: string;
  active_until?: string;
  permissions: DesignatePermissions;
  approval: DesignateApproval;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  owner: string;
  stakeholders: Stakeholder[];
  designates: Designate[];
  override_permitted: boolean;
  override_flagging: OverrideFlagging;
  routing: {
    governance_denial: RoutingRule;
    content_request: RoutingRule;
  };
}

interface DomainsViewProps {
  role: Role;
  ownedDomains: string[];
}

const USER_NAMES: Record<string, string> = {
  'jordan@acme.com': 'Jordan Lee',
  'sam@acme.com':    'Sam Chen',
  'alex@acme.com':   'Alex Rivera',
  'taylor@acme.com': 'Taylor Brooks',
  'u1': 'Alex Rivera',
  'u2': 'Jordan Lee',
  'u3': 'Sam Chen',
  'u4': 'Taylor Brooks',
};

function userName(emailOrId: string): string {
  return USER_NAMES[emailOrId] ?? emailOrId;
}

const ALL_DOMAINS: Domain[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing site, campaign content, and demand generation copy.',
    owner: 'jordan@acme.com',
    stakeholders: [{ email: 'alex@acme.com', relationship: 'informed' }],
    designates: [],
    override_permitted: true,
    override_flagging: {
      enabled: true,
      threshold_per_item: 3,
      threshold_per_area: 5,
      notify: ['alex@acme.com'],
    },
    routing: {
      governance_denial: { owner: 'jordan@acme.com', log: 'logs/requests.md', notify: ['alex@acme.com'] },
      content_request:   { owner: 'jordan@acme.com', log: 'logs/requests.md', notify: [] },
    },
  },
  {
    id: 'product',
    name: 'Product',
    description: 'In-app copy, onboarding flows, error messages, and UI microcopy.',
    owner: 'sam@acme.com',
    stakeholders: [{ email: 'alex@acme.com', relationship: 'informed' }],
    designates: [
      {
        user_id: 'u4',
        type: 'standing',
        permissions: {
          can_override_governance: false,
          can_resolve_requests: true,
          can_view_logs: true,
        },
        approval: {
          status: 'approved',
          approved_by: 'u1',
          approved_at: '2026-09-01',
        },
      },
      {
        user_id: 'u2',
        type: 'temporary',
        active_from: '2026-09-15',
        active_until: '2026-09-22',
        permissions: {
          can_override_governance: false,
          can_resolve_requests: true,
          can_view_logs: true,
        },
        approval: {
          status: 'pending',
          approved_by: null,
          approved_at: null,
        },
      },
    ],
    override_permitted: true,
    override_flagging: {
      enabled: true,
      threshold_per_item: 3,
      threshold_per_area: 5,
      notify: ['alex@acme.com'],
    },
    routing: {
      governance_denial: { owner: 'sam@acme.com', log: 'logs/requests.md', notify: ['alex@acme.com'] },
      content_request:   { owner: 'sam@acme.com', log: 'logs/requests.md', notify: [] },
    },
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Terms of service, privacy policy, and compliance-adjacent content.',
    owner: 'alex@acme.com',
    stakeholders: [],
    designates: [],
    override_permitted: false,
    override_flagging: {
      enabled: true,
      threshold_per_item: 1,
      threshold_per_area: 2,
      notify: ['alex@acme.com'],
    },
    routing: {
      governance_denial: { owner: 'alex@acme.com', log: 'logs/requests.md', notify: [] },
      content_request:   { owner: 'alex@acme.com', log: 'logs/requests.md', notify: [] },
    },
  },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({ label, variant = 'neutral' }: { label: string; variant?: 'teal' | 'neutral' | 'muted' | 'warning' }) {
  const styles: Record<string, React.CSSProperties> = {
    teal:    { color: 'var(--teal)',       backgroundColor: 'var(--teal-light)' },
    neutral: { color: '#0A4A3A',           backgroundColor: '#D5F0E8' },
    muted:   { color: 'var(--text-muted)', backgroundColor: 'var(--bg-mid)' },
    warning: { color: '#7A4F00',           backgroundColor: '#FFF3CD' },
  };
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 600,
      borderRadius: '4px',
      padding: '2px 8px',
      ...styles[variant],
    }}>
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      fontSize: '13.5px',
      lineHeight: 1.55,
      marginBottom: '6px',
    }}>
      <span style={{ color: 'var(--text-muted)', minWidth: '180px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}

function PermissionList({ permissions }: { permissions: DesignatePermissions }) {
  const items = [
    { label: 'Override governance', value: permissions.can_override_governance },
    { label: 'Resolve requests',    value: permissions.can_resolve_requests },
    { label: 'View logs',           value: permissions.can_view_logs },
  ];
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {items.map(item => (
        <Pill
          key={item.label}
          label={item.label}
          variant={item.value ? 'neutral' : 'muted'}
        />
      ))}
    </div>
  );
}

function DesignateCard({ designate }: { designate: Designate }) {
  const isTemporary = designate.type === 'temporary';
  const isPending = designate.approval.status === 'pending';

  const dateRange = isTemporary && designate.active_from && designate.active_until
    ? `${designate.active_from} – ${designate.active_until}`
    : null;

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 14px',
      marginBottom: '8px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px',
      }}>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          {userName(designate.user_id)}
        </span>
        <Pill label={isTemporary ? 'Temporary' : 'Standing'} variant={isTemporary ? 'warning' : 'neutral'} />
        <Pill label={isPending ? 'Pending approval' : 'Approved'} variant={isPending ? 'muted' : 'teal'} />
      </div>

      {dateRange && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          {dateRange}
        </div>
      )}

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>
        Permissions
      </div>
      <PermissionList permissions={designate.permissions} />

      {!isPending && designate.approval.approved_by && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
          Approved by {userName(designate.approval.approved_by)}
          {designate.approval.approved_at ? ` · ${designate.approval.approved_at}` : ''}
        </div>
      )}
    </div>
  );
}

function ApprovalsSection({ designates }: { designates: Designate[] }) {
  if (designates.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          No one assigned yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {designates.map((d, i) => (
        <DesignateCard key={`${d.user_id}-${i}`} designate={d} />
      ))}
    </div>
  );
}

function DomainCard({ domain, defaultOpen }: { domain: Domain; defaultOpen: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);

  const overrideStatus = !domain.override_permitted
    ? { label: 'Not permitted', variant: 'muted' as const }
    : { label: 'Permitted', variant: 'neutral' as const };

  const flaggingLabel = domain.override_flagging.enabled
    ? `Flagged after ${domain.override_flagging.threshold_per_item} per item · ${domain.override_flagging.threshold_per_area} per area`
    : 'Flagging disabled';

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '8px',
    }}>
      {/* Card header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          marginTop: '4px',
          flexShrink: 0,
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease',
          display: 'inline-block',
        }}>
          ▶
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '5px',
          }}>
            {domain.name}
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {userName(domain.owner)}
            </span>
            <span style={{ color: 'var(--border-mid)', fontSize: '12px' }}>·</span>
            <Pill label={overrideStatus.label} variant={overrideStatus.variant} />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 18px 20px 42px',
        }}>
          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '22px',
          }}>
            {domain.description}
          </p>

          <Section label="Ownership">
            <Row
              label="Domain owner"
              value={`${userName(domain.owner)} · ${domain.owner}`}
            />
            {domain.stakeholders.length > 0 ? (
              domain.stakeholders.map(s => (
                <Row
                  key={s.email}
                  label={`Stakeholder · ${s.relationship}`}
                  value={`${userName(s.email)} · ${s.email}`}
                />
              ))
            ) : (
              <Row label="Stakeholders" value={<span style={{ color: 'var(--text-muted)' }}>None</span>} />
            )}
          </Section>

          <Section label="Override permissions">
            <Row
              label="Override permitted"
              value={<Pill label={overrideStatus.label} variant={overrideStatus.variant} />}
            />
            {domain.override_flagging.enabled && (
              <>
                <Row label="Flagging thresholds" value={flaggingLabel} />
                {domain.override_flagging.notify.length > 0 && (
                  <Row
                    label="Notify on flag"
                    value={domain.override_flagging.notify.map(userName).join(', ')}
                  />
                )}
              </>
            )}
          </Section>

          <Section label="Request routing">
            <Row
              label="Governance flags route to"
              value={userName(domain.routing.governance_denial.owner)}
            />
            {domain.routing.governance_denial.notify.length > 0 && (
              <Row
                label="Also notify"
                value={domain.routing.governance_denial.notify.map(userName).join(', ')}
              />
            )}
            <Row
              label="Content requests route to"
              value={userName(domain.routing.content_request.owner)}
            />
            {domain.routing.content_request.notify.length > 0 && (
              <Row
                label="Also notify"
                value={domain.routing.content_request.notify.map(userName).join(', ')}
              />
            )}
          </Section>

          <Section label="Designates">
            <ApprovalsSection designates={domain.designates} />
          </Section>
        </div>
      )}
    </div>
  );
}

export default function DomainsView({ role, ownedDomains }: DomainsViewProps) {
  const visibleDomains = role === 'content_owner'
    ? ALL_DOMAINS
    : ALL_DOMAINS.filter(d => ownedDomains.includes(d.id));

  const defaultOpenFor = (domain: Domain) =>
    role === 'domain_owner' && ownedDomains.includes(domain.id);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
    }}>
      <div style={{ padding: '28px 36px 0', flexShrink: 0 }}>
        <h1 style={{
          fontSize: '16px',
          lineHeight: 1.25,
          fontWeight: 700,
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.01em',
          marginBottom: '8px',
        }}>
          Domains
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          marginBottom: '24px',
        }}>
          {role === 'content_owner'
            ? 'All configured domains — owners, stakeholders, routing, and override settings.'
            : 'Your domain configuration — ownership, routing, and override settings.'}
        </p>
        <div style={{ borderBottom: '1px solid var(--border)' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 36px 36px' }}>
        {visibleDomains.length === 0 ? (
          <div style={{
            marginTop: '60px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}>
            No domains assigned.
          </div>
        ) : (
          <div style={{ maxWidth: '740px' }}>
            {visibleDomains.map(domain => (
              <DomainCard
                key={domain.id}
                domain={domain}
                defaultOpen={defaultOpenFor(domain)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
