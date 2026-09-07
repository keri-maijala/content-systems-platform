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

const SUGGESTIONS = [
  'Review this copy for plain language',
  'Does this follow our voice and tone?',
  'Help me write an error message',
  'Check this for inclusive language',
];

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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Add empty assistant message to stream into
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #E8E4DC', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Fraunces, Georgia, serif' }}>Agent</h1>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>{clientName}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '560px' }}>
            <h2 style={{ fontSize: '26px', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#1A1A2E', marginBottom: '12px', lineHeight: 1.2 }}>
              What are you working on?
            </h2>
            <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.6, maxWidth: '440px' }}>
              Ask a question, share content for review, or describe what you need.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  style={{ textAlign: 'left', padding: '12px 16px', background: 'transparent', border: '1px solid #D9D4C9', borderRadius: '6px', fontSize: '14px', color: '#6B7280', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color 0.15s, color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#4A6FA5'); (e.currentTarget.style.color = '#1A1A2E'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#D9D4C9'); (e.currentTarget.style.color = '#6B7280'); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '640px',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              backgroundColor: msg.role === 'user' ? '#1A1A2E' : '#F7F6F3',
              color: msg.role === 'user' ? '#fff' : '#1A1A2E',
              fontSize: '15px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content || (loading && i === messages.length - 1 ? '…' : '')}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', padding: '0 4px' }}>
              {msg.role === 'user' ? userName : 'Agent'} · {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '20px 32px', borderTop: '1px solid #E8E4DC', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', maxWidth: '800px' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); handleInput(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or share content for review…"
            rows={1}
            style={{ flex: 1, resize: 'none', border: '1px solid #D9D4C9', borderRadius: '8px', padding: '12px 16px', fontSize: '15px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1A1A2E', backgroundColor: '#F7F6F3', outline: 'none', lineHeight: 1.5, minHeight: '48px', maxHeight: '180px', overflowY: 'auto' }}
            onFocus={e => { e.target.style.borderColor = '#4A6FA5'; }}
            onBlur={e => { e.target.style.borderColor = '#D9D4C9'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{ padding: '12px 20px', backgroundColor: input.trim() && !loading ? '#1A1A2E' : '#E8E4DC', color: input.trim() && !loading ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontFamily: 'Inter, system-ui, sans-serif', height: '48px', whiteSpace: 'nowrap' }}
          >
            {loading ? 'Thinking…' : 'Send'}
          </button>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#9CA3AF' }}>
          Enter to send · Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
