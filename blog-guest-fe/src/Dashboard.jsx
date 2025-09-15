import { useEffect, useState } from "react";

function DisplayDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data); //data has {id, email, role}
      } else {
        //redirect to /login on 401
      }
    })();
  }, []);

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
          <h3>{p.title}</h3>
          <p>{p.createdAt}</p>
        </li>
      ))}
    </ul>
  );
}

export { DisplayDashboard, PostsList };
