import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DisplayDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(state?.user ?? null);

  useEffect(() => {
    if (user) return;
    (async () => {
      const res = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? data); //data has {id, email, role}
      } else if (res.status === 401) {
        navigate("/login", { replace: true });
      }
    })();
  }, [user, navigate]);

  return <h1>Hello {user?.email ?? "Secret World"}!</h1>;
}

function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/posts", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    })();
  }, []);

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>
          <h3>
            <a href={`/posts/${p.id}`}>{p.title}</a>
          </h3>
          <p>{p.createdAt}</p>
        </li>
      ))}
    </ul>
  );
}

export { DisplayDashboard, PostsList };
