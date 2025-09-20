const API = "http://localhost:3000";

export async function api(
  path,
  { method = "GET", body, headers = {}, ...rest } = {}
) {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });
  return res;
}
