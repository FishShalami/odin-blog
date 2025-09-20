import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    const res = await api("/api/posts/new", {
      method: "POST",
      body: { post_title: title, content },
    });
    setPending(false);
    if (res.ok) navigate("/");
    else alert("Failed to create post");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>New Post</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        rows={6}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button type="submit" disabled={pending || !title.trim()}>
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
