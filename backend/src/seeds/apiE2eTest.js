import dotenv from "dotenv";
dotenv.config();
const base = process.env.BACKEND_BASE_URL || "http://localhost:5000";

async function go() {
  try {
    console.log("API e2e test to", base);
    // login as sample buyer
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "sample_buyer_auto",
        password: "password123",
      }),
    });
    const loginJson = await loginRes.json();
    console.log("LOGIN:", loginRes.status, JSON.stringify(loginJson));
    const token =
      loginJson.accessToken ||
      loginJson.token ||
      (loginJson.user && loginJson.user.token) ||
      loginJson.accessToken;

    // get products
    const productsRes = await fetch(`${base}/api/products`);
    const products = await productsRes.json();
    console.log(
      "PRODUCTS count:",
      Array.isArray(products) ? products.length : 0
    );
    if (Array.isArray(products))
      console.log("PRODUCT sample:", products.slice(0, 3));

    // get posts
    const postsRes = await fetch(`${base}/api/posts`);
    const posts = await postsRes.json();
    console.log("POSTS count:", Array.isArray(posts) ? posts.length : 0);

    // create a new post if we have a product and token
    if (token && products && products[0]) {
      const payload = {
        title: "E2E test order",
        description: "Test create post",
        product: products[0]._id,
        buyer:
          loginJson.user?._id || (loginJson.user && loginJson.user._id) || null,
        quantity: 10,
        unitPrice: products[0].pricePerUnit || 0,
      };
      const createRes = await fetch(`${base}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const created = await createRes.json();
      console.log("CREATE POST:", createRes.status, created);
    }

    // find a post that has bids
    let found = null;
    for (const p of posts) {
      const dres = await fetch(`${base}/api/posts/${p._id}`);
      if (!dres.ok) continue;
      const dto = await dres.json();
      if (dto.bids && dto.bids.length > 0) {
        found = dto;
        break;
      }
    }
    console.log("FOUND post with bids:", !!found);
    if (found) {
      console.log("Post id:", found.post._id, "bids:", found.bids.length);
      const bid = found.bids[0];
      console.log("Attempting to accept bid id", bid._id);
      const acc = await fetch(`${base}/api/bids/${bid._id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      console.log("ACCEPT BID:", acc.status, await acc.text());
    }

    console.log("E2E test finished");
  } catch (e) {
    console.error("E2E ERR", e);
    process.exit(1);
  }
}

go();
