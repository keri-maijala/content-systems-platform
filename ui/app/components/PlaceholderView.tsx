interface PlaceholderViewProps {
  title: string;
  description: string;
}

export default function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 32px',
      backgroundColor: 'var(--bg)',
    }}>
      <div style={{
        padding: '20px 0',
        borderBottom: '1px solid var(--border)',
        marginBottom: '40px',
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--navy)',
          fontFamily: 'Fraunces, Georgia, serif',
        }}>
          {title}
        </h1>
      </div>
      <div style={{
        maxWidth: '480px',
      }}>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}
