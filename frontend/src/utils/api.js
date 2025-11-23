// Lightweight fetch wrapper used across the frontend.
// - Uses `VITE_API_BASE` if set, otherwise defaults to relative `/api` which
//   works with the Vite dev proxy.
// - Returns parsed JSON on success, throws an Error with a helpful message on failure.
export default async function apiFetch(path, opts = {}) {
  const base = import.meta.env.VITE_API_BASE || "/api";
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;

  const cfg = {
    credentials: "include",
    ...opts,
  };

  let res;
  try {
    res = await fetch(url, cfg);
  } catch (err) {
    throw new Error(`Cannot connect to backend (${base}): ${err.message}`);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" ? data : res.statusText) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}
