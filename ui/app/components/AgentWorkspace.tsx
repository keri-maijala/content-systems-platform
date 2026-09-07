'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentWorkspaceProps {
  userName: string;
  clientName: string;
}

export default function AgentWorkspace({ userName, clientName }: AgentWorkspaceProps) {
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Placeholder response until agent engine is wired in
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'The agent engine is not yet connected. This is a UI shell preview.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 800);
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--agent-bg)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--navy)',
          fontFamily: 'Fraunces, Georgia, serif',
        }}>
          Agent
        </h1>
        <span style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          {clientName}
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: '560px',
          }}>
            <h2 style={{
              fontSize: '26px',
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 600,
              color: 'var(--navy)',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}>
              What are you working on?
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '440px',
            }}>
              Ask a question, share content for review, or describe what you need. You can paste text or upload a screenshot.
            </p>

            {/* Prompt suggestions */}
            <div style={{
              marginTop: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              maxWidth: '480px',
            }}>
              {[
                'Review this copy for plain language',
                'Does this follow our voice and tone?',
                'Help me write an error message',
                'Check this for inclusive language',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.borderColor = 'var(--blue)';
                    (e.target as HTMLButtonElement).style.color = 'var(--navy)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                    (e.target as HTMLButtonElement).style.color = 'var(--text-muted)';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '100%',
          }}>
            <div style={{
              maxWidth: '640px',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              backgroundColor: msg.role === 'user' ? 'var(--navy)' : 'var(--bg)',
              color: msg.role === 'user' ? 'var(--white)' : 'var(--text)',
              fontSize: '15px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              padding: '0 4px',
            }}>
              {msg.role === 'user' ? userName : 'Agent'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '14px 18px',
            backgroundColor: 'var(--bg)',
            borderRadius: '12px 12px 12px 2px',
            width: 'fit-content',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-muted)',
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px 32px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--white)',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          maxWidth: '800px',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); handleInput(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or share content for review…"
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '15px',
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'var(--text)',
              backgroundColor: 'var(--bg)',
              outline: 'none',
              lineHeight: 1.5,
              minHeight: '48px',
              maxHeight: '180px',
              overflowY: 'auto',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--blue)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{
              padding: '12px 20px',
              backgroundColor: input.trim() && !loading ? 'var(--navy)' : 'var(--bg-secondary)',
              color: input.trim() && !loading ? 'var(--white)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'background-color 0.15s',
              height: '48px',
              whiteSpace: 'nowrap',
            }}
          >
            Send
          </button>
        </div>
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          Enter to send · Shift + Enter for new line
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
