import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./useAuth";
import RequireAuthor from "./components/RequireAuthor";
import AuthorDashboard from "./pages/AuthorDashboard";
import NewPost from "./pages/NewPost";
import PostComments from "./pages/PostComments";
import PostUpdate from "./pages/PostUpdate";

import { api } from "./api";

function Shell() {
  // const navigate = useNavigate();
  async function handleLogout() {
    await api("/api/auth/logout", { method: "POST" });
    window.location.href = "http://localhost:5173/";
  }
  return (
    <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <Link to="/">Dashboard</Link>
      <Link to="/posts/new">New Post</Link>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <BrowserRouter>
      <RequireAuthor user={user} loading={loading}>
        <Shell />
        <Routes>
          <Route path="/" element={<AuthorDashboard />} />
          <Route path="/posts/new" element={<NewPost />} />
          <Route path="/posts/:id/comments" element={<PostComments />} />
          <Route path="/posts/:id/update" element={<PostUpdate />} />
        </Routes>
      </RequireAuthor>
    </BrowserRouter>
  );
}
