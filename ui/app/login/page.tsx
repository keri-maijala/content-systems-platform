'use client';

export default function LoginPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('submitted');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}
