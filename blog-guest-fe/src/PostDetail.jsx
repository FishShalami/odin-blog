// PostDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "./components/Button";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    })();
  }, [id]);
  //   console.log("request blog post with id: ", id);
  if (!post) return <p>Loading…</p>;
  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>{post.createdAt}</p>
        <div>{post.content}</div>
      </article>
      <br />
      <Button to="dashboard" label="Back to Dashboard" />
    </div>
  );
}
