import { API_BASE_URL } from "./config";

export async function api(
  path,
  { method = "GET", body, headers = {}, ...rest } = {}
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });
  return res;
}

export { API_BASE_URL };
