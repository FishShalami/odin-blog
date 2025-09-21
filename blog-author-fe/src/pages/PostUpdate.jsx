// PostDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function PostUpdate() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        const p = data.post ?? data;

        if (active) {
          setPost(p);
          setFormData({ title: p.title ?? "", content: p.content ?? "" });
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (active) {
          setError(e.message || "Error loading post");
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await api(`/api/posts/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.message || "Update failed";
        throw new Error(msg);
      }
      // Navigate back or show a success state
      navigate("/"); // or navigate(`/posts/${id}`)
    } catch (e) {
      console.error(e);
      setError(e.message || "Error updating post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginTop: 6 }}
            required
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Content:
          <textarea
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginTop: 6 }}
            required
          />
        </label>

        <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Updating…" : "Update Post"}
        </button>
        <Link to="/" style={{ marginLeft: 12 }}>
          Cancel
        </Link>
      </form>
    </div>
  );
}
