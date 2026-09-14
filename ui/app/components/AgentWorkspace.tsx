'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserContext {
  name: string;
  role: 'contributor' | 'domain_owner' | 'content_owner';
  domains: string[];
}

interface AgentWorkspaceProps {
  userName: string;
  clientName: string;
  clientKey: string;
  user: UserContext | null;
}

const SUGGESTIONS = [
  'Review this copy for plain language',
  'Does this follow our voice and tone?',
  'Help me write an error message',
  'Check this for inclusive language',
];

export default function AgentWorkspace({ userName, clientName, clientKey, user }: AgentWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          clientKey,
          user,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();

      let fullContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullContent,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Something went wrong. Please try again.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isEmpty = messages.length === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--white)',
    }}>

      {isEmpty ? (
        /* ── Empty state: composer top-anchored, aligned with nav header ── */
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 36px 36px',
          maxWidth: '680px',
          width: '100%',
        }}>
          {/* Heading — sits at same height as nav wordmark */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--ink)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
              marginBottom: '4px',
            }}>
              What are you working on?
            </h1>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{clientName}</span>
          </div>

          {/* Composer */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); handleInput(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or share content for review…"
              rows={4}
              style={{
                display: 'block',
                width: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                padding: '14px 16px',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                color: 'var(--ink)',
                backgroundColor: 'transparent',
                lineHeight: 1.6,
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '8px 12px',
              borderTop: '1px solid var(--border)',
            }}>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  padding: '7px 16px',
                  backgroundColor: input.trim() && !loading ? 'var(--ink)' : 'var(--bg-mid)',
                  color: input.trim() && !loading ? 'var(--white)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-ui)',
                  transition: 'background-color 0.12s',
                }}
              >
                {loading ? 'Thinking…' : 'Send'}
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '14px',
          }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  textareaRef.current?.focus();
                }}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  transition: 'border-color 0.12s, color 0.12s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--teal)';
                  e.currentTarget.style.color = 'var(--ink)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Active conversation ── */
        <>
          {/* Slim header — no bottom border */}
          <div style={{
            padding: '18px 36px 0',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
          }}>
            <h1 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--ink)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}>
              Agent
            </h1>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{clientName}</span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '640px',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user'
                    ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)'
                    : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
                  backgroundColor: msg.role === 'user' ? 'var(--ink)' : 'var(--bg-mid)',
                  color: msg.role === 'user' ? 'var(--white)' : 'var(--ink)',
                  fontSize: '14px',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content || (loading && i === messages.length - 1 ? '…' : '')}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  padding: '0 4px',
                }}>
                  {msg.role === 'user' ? userName : 'Agent'} · {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: '16px 36px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--white)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end',
              maxWidth: '800px',
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); handleInput(); }}
                onKeyDown={handleKeyDown}
                placeholder="Reply…"
                rows={1}
                style={{
                  flex: 1,
                  resize: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--ink)',
                  backgroundColor: 'var(--bg)',
                  outline: 'none',
                  lineHeight: 1.55,
                  minHeight: '42px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  transition: 'border-color 0.12s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  padding: '10px 18px',
                  backgroundColor: input.trim() && !loading ? 'var(--ink)' : 'var(--bg-mid)',
                  color: input.trim() && !loading ? 'var(--white)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-ui)',
                  height: '42px',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.12s',
                }}
              >
                {loading ? 'Thinking…' : 'Send'}
              </button>
            </div>
            <div style={{
              marginTop: '6px',
              fontSize: '11.5px',
              color: 'var(--text-muted)',
            }}>
              Enter to send · Shift + Enter for new line
            </div>
          </div>
        </>
      )}
    </div>
  );
}
