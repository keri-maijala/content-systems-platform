'use client';

import { useState, useEffect } from 'react';

type Status = 'open' | 'in_progress' | 'resolved';
type RequestType = 'direct' | 'inferred';

interface Request {
  id: string;
  title: string;
  detail: string;
  type: RequestType;
  domain: string;
  status: Status;
  originator: string;
  originatorName: string;
  owner: string;
  ownerName: string;
  watchers: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface RequestsViewProps {
  role: string;
  userEmail: string;
}

const STATUS_LABELS: Record<Status, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  open: { bg: '#FEF3C7', text: '#92400E' },
  in_progress: { bg: '#DBEAFE', text: '#1E40AF' },
  resolved: { bg: '#D1FAE5', text: '#065F46' },
};

const TYPE_LABELS: Record<RequestType, string> = {
  direct: 'Direct',
  inferred: 'Inferred',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function canResolve(role: string) {
  return role === 'content_owner' || role === 'domain_owner';
}

export default function RequestsView({ role, userEmail }: RequestsViewProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setRequests(data.requests);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  async function handleStatusChange(requestId: string, status: Status) {
    setUpdating(requestId);
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(prev => prev.map(r => r.id === requestId ? data.request : r));
    } catch {
      // silent fail for now
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const counts = {
    all: requests.length,
    open: requests.filter(r => r.status === 'open').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#F7F6F3',
    }}>
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid #E5E0D8',
        backgroundColor: '#F7F6F3',
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1A1A2E',
          fontFamily: 'Fraunces, Georgia, serif',
          marginBottom: '16px',
        }}>
          Requests
        </h1>

        <div style={{ display: 'flex', gap: '4px' }}>
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: filter === f ? 500 : 400,
                color: filter === f ? '#1A1A2E' : '#6B7280',
                backgroundColor: filter === f ? '#E5E0D8' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In progress' : STATUS_LABELS[f as Status]}
              <span style={{
                marginLeft: '6px',
                fontSize: '12px',
                color: filter === f ? '#1A1A2E' : '#9CA3AF',
              }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {loading && (
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Loading requests…</p>
        )}
        {error && (
          <p style={{ fontSize: '14px', color: '#DC2626' }}>Could not load requests.</p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>No requests in this view.</p>
        )}

        {!loading && !error && filtered.map(request => {
          const isExpanded = expanded === request.id;
          const statusStyle = STATUS_COLORS[request.status];
          const isUpdating = updating === request.id;

          return (
            <div key={request.id} style={{
              backgroundColor: '#fff',
              border: '1px solid #E5E0D8',
              borderRadius: '8px',
              marginBottom: '12px',
              overflow: 'hidden',
            }}>
              <div
                onClick={() => setExpanded(isExpanded ? null : request.id)}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#1A1A2E',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}>
                      {request.title}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {STATUS_LABELS[request.status]}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#F3F4F6',
                      color: '#6B7280',
                    }}>
                      {TYPE_LABELS[request.type]}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    {request.domain} · {request.originatorName} · {formatDate(request.createdAt)}
                  </div>
                </div>
                <span style={{
                  fontSize: '16px',
                  color: '#9CA3AF',
                  marginTop: '2px',
                  display: 'inline-block',
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s',
                }}>
                  &#9662;
                </span>
              </div>

              {isExpanded && (
                <div style={{
                  padding: '0 20px 20px',
                  borderTop: '1px solid #F3F4F6',
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: 1.6,
                    margin: '16px 0',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    {request.detail}
                  </p>
                  <div style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    marginBottom: '16px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    <span>Owner: {request.ownerName}</span>
                    {request.resolvedAt && (
                      <span> · Resolved {formatDate(request.resolvedAt)}</span>
                    )}
                  </div>

                  {canResolve(role) && request.status !== 'resolved' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {request.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'in_progress')}
                          disabled={isUpdating}
                          style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            color: '#1A1A2E',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E0D8',
                            borderRadius: '6px',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Mark in progress
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(request.id, 'resolved')}
                        disabled={isUpdating}
                        style={{
                          padding: '8px 14px',
                          fontSize: '13px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontWeight: 500,
                          color: '#fff',
                          backgroundColor: isUpdating ? '#9CA3AF' : '#1A1A2E',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isUpdating ? 'Saving…' : 'Mark resolved'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
