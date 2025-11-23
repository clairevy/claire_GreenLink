import dotenv from "dotenv";
dotenv.config();
const base = process.env.BACKEND_BASE_URL || "http://localhost:5000";

async function run() {
  try {
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "sample_buyer_auto",
        password: "password123",
      }),
    });
    const lj = await loginRes.json();
    console.log("LOGIN", loginRes.status, lj);
    const userId = lj.user?._id || lj._id || lj.user?.id || lj.user?.data?._id;
    const token = lj.accessToken || lj.token || lj.user?.token;
    if (!userId)
      console.warn("Could not determine user id from login response");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const postsRes = await fetch(
      `${base}/api/posts${userId ? `?buyer=${userId}` : ""}`,
      { headers }
    );
    const posts = await postsRes.json();
    console.log("MY POSTS COUNT:", Array.isArray(posts) ? posts.length : 0);
    console.log(JSON.stringify(posts, null, 2));
  } catch (e) {
    console.error("ERR", e);
    process.exit(1);
  }
}

run();
