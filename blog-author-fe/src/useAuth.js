import { useEffect, useState } from "react";
import { api } from "./api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api("/api/me");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (active) setUser(data.user ?? data); // supports {id,email,role}
      } catch (e) {
        if (active) setError("Unauthorized");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { user, loading, error };
}
