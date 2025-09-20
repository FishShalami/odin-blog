export default function RequireAuthor({ user, loading, children }) {
  if (loading) return <p>Loading…</p>;
  if (!user) return <p>You are not logged in.</p>;
  if (user.role !== "AUTHOR") return <p>Not authorized (AUTHOR required).</p>;
  return children;
}
