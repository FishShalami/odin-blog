// PostDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "./components/Button";

function PostDetail() {
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
      <form action="../api/comments/new" method="post">
        <label htmlFor="comment_content">Leave a comment: </label>
        <textarea name="comment_content" id="comment_content"></textarea>
        <button type="submit">Comment</button>
      </form>
      <br />
      <Button to="dashboard" label="Back to Dashboard" />
    </div>
  );
}

function PostComments() {
  const { id } = useParams();
  const [comments, setComment] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComment(data.comments);
      }
    })();
  }, [id]);
  //   console.log("request blog post with id: ", id);
  if (!comments) return <p>Loading…</p>;
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <p>
            On {c.createdAt}
            <b> {c.user.name} said:</b>
          </p>
          <p>{c.content}</p>
        </li>
      ))}
    </ul>
  );
}

export { PostDetail, PostComments };
