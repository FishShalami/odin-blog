import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function AuthorDashboard() {
  const [posts, setPosts] = useState([]);

  async function load() {
    const res = await api("/api/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts ?? []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    const res = await api(`/api/posts/${id}/delete`, { method: "POST" });
    if (res.ok) setPosts((p) => p.filter((x) => x.id !== id));
    else alert("Failed to delete post");
  }

  return (
    <div>
      <h1> Posts</h1>
      {!posts.length && <p>No posts yet.</p>}
      <ul>
        {posts.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <b>{p.title}</b>{" "}
            <Link to={`/posts/${p.id}/comments`}>Manage comments</Link>{" "}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
