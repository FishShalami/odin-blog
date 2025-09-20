import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function PostComments() {
  const { id } = useParams();
  const postId = Number(id);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState("");

  async function load() {
    const [postRes, res] = await Promise.all([
      api(`/api/posts/${postId}`),
      api(`/api/posts/${postId}/comments`),
    ]);
    if (postRes.ok) {
      const data = await postRes.json();
      setTitle((data.post ?? data)?.title ?? "");
    }
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments ?? []);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function handleDelete(commentId) {
    const res = await api(`/api/posts/${postId}/comments/${commentId}/delete`, {
      method: "POST",
    });
    if (res.ok) setComments((c) => c.filter((x) => x.id !== commentId));
    else alert("Failed to delete comment");
  }

  return (
    <div>
      <h1>Comments for: {title || `Post #${postId}`}</h1>
      {!comments.length && <p>No comments.</p>}
      <ul>
        {comments.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <p>
              <b>{c.user?.name ?? "Anonymous"}</b>: {c.content}
            </p>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
