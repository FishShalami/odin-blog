// PostDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "./components/Button";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add delete button!

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        if (active) {
          setPost(data.post ?? data); // supports { post } or raw post
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>{new Date(post.createdAt).toLocaleString()}</p>
        <div>{post.content}</div>
      </article>

      <hr />

      {/* Comments section handles its own fetch + form */}
      <CommentsSection postId={Number(id)} />

      <br />
      {/* If your Button comp wraps a <Link>, keep using it.
          Otherwise a plain Link works fine: <Link to="/dashboard">Back</Link> */}
      <Button to="dashboard" label="Back to Dashboard" />
    </div>
  );
}

/** Container component: state + effects. Keeps children pure. */
function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch comments for this post
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Prefer a dedicated route: /api/posts/:id/comments
        const res = await fetch(
          `http://localhost:3000/api/posts/${postId}/comments`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        if (active) {
          setComments(data.comments ?? data.commentsPreview ?? []);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (active) {
          setError("Could not load comments.");
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [postId]);

  async function handleAddComment(content) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) throw new Error("Failed to post comment");
      const { comment } = await res.json();
      if (!comment?.id)
        throw new Error("Server did not return a comment with id");
      setComments((prev) => [comment, ...prev]); // newest first
      return true;
    } catch (e) {
      console.error(e);
      setError("Could not post comment.");
      return false;
    }
  }

  return (
    <section className="comment-section">
      <h2>Comments</h2>
      <CommentForm onSubmit={handleAddComment} />
      {loading && <p>Loading comments…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && <CommentsList comments={comments} />}
    </section>
  );
}

/** Pure presentational: just reads props and renders. */
function CommentsList({ comments }) {
  if (!comments.length) return <p>No comments yet.</p>;
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id} style={{ marginBottom: "1rem" }}>
          <p>
            On {new Date(c.createdAt).toLocaleString()}
            <b> {c.user?.name ?? "Anonymous"} said:</b>
          </p>
          <p>{c.content}</p>
        </li>
      ))}
    </ul>
  );
}

/** Pure presentational: controlled input + submit callback. */
function CommentForm({ onSubmit }) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setPending(true);
    const ok = await onSubmit(value.trim());
    if (ok) setValue("");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <label htmlFor="comment_content">Leave a comment:</label>
      <br />
      <textarea
        id="comment_content"
        name="comment_content"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={pending}
        style={{ width: "100%" }}
      />
      <br />
      <button type="submit" disabled={pending || !value.trim()}>
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
