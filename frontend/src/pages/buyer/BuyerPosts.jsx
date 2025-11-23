import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Badge = ({ children, color = "gray" }) => (
  <span
    style={{
      padding: "6px 10px",
      borderRadius: 8,
      background: color,
      color: "#fff",
      fontSize: 13,
    }}
  >
    {children}
  </span>
);

const BuyerPosts = () => {
  const { user } = useAuth();
  const apiBase = import.meta.env.VITE_API_BASE || "/api";

  const [form, setForm] = useState({
    title: "",
    description: "",
    product: "",
    quantity: 0,
    unitPrice: 0,
    preferredDate: "",
  });
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailPost, setDetailPost] = useState(null); // post with bids
  const [suppliers, setSuppliers] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bidId: null,
    supplierId: null,
  });

  const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  const userId = user?.data?._id || user?.user?._id || user?._id || user?.id;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [prodsRes, postsRes] = await Promise.all([
          fetch(`${apiBase}/products`, { headers }),
          fetch(`${apiBase}/posts${userId ? `?buyer=${userId}` : ""}`, {
            headers,
          }),
        ]);

        const prods = prodsRes.ok ? await prodsRes.json() : [];
        const psts = postsRes.ok ? await postsRes.json() : [];

        const postsWithBids = Array.isArray(psts)
          ? await Promise.all(
              psts.map(async (p) => {
                try {
                  const d = await fetch(`${apiBase}/posts/${p._id}`, {
                    headers,
                  });
                  if (!d.ok) return { ...p, bids: [] };
                  const dto = await d.json();
                  return { ...p, bids: dto.bids || [] };
                } catch (e) {
                  return { ...p, bids: [] };
                }
              })
            )
          : [];

        if (!cancelled) {
          setProducts(prods || []);
          setPosts(postsWithBids);
        }
      } catch (err) {
        console.error("Failed to load buyer posts page", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // load suppliers for confirm modal
    (async function loadSuppliers() {
      try {
        const r = await fetch(`${apiBase}/users`, { headers });
        if (!r.ok) return;
        const all = await r.json();
        setSuppliers((all || []).filter((u) => u.role === "supplier"));
      } catch (e) {
        console.error("loadSuppliers", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase, userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function createPost(e) {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description,
        product: form.product,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        preferredDate: form.preferredDate || null,
      };
      const res = await fetch(`${apiBase}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // refresh list
        const created = await res.json();
        setPosts((p) => [created, ...p]);
        setForm({
          title: "",
          description: "",
          product: "",
          quantity: 0,
          unitPrice: 0,
          preferredDate: "",
        });
      } else {
        console.error("Create post failed", await res.text());
      }
    } catch (err) {
      console.error("Create post error", err);
    }
  }

  async function openDetails(postId) {
    try {
      const res = await fetch(`${apiBase}/posts/${postId}`, { headers });
      if (!res.ok) return;
      const dto = await res.json();
      setDetailPost(dto);
    } catch (err) {
      console.error("openDetails", err);
    }
  }

  // open confirm modal to accept and pick supplier
  function openAcceptConfirm(bidId) {
    setConfirmModal({
      open: true,
      bidId,
      supplierId: suppliers[0]?._id || null,
    });
  }

  async function acceptBid(bidId, supplierId) {
    try {
      const res = await fetch(`${apiBase}/bids/${bidId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ status: "accepted", supplierId }),
      });
      if (!res.ok) {
        console.error("acceptBid failed", await res.text());
        return false;
      }
      const updated = await res.json();
      // refresh posts and details
      await openDetails(updated.post || updated.post?._id || updated.post);
      // update posts list locally
      setPosts((list) =>
        list.map((p) =>
          p._id === (updated.post || updated.post?._id)
            ? { ...p, status: "closed" }
            : p
        )
      );
      return true;
    } catch (err) {
      console.error("acceptBid error", err);
      return false;
    }
  }

  async function declineBid(bidId) {
    try {
      const res = await fetch(`${apiBase}/bids/${bidId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) {
        console.error("declineBid failed", await res.text());
        return;
      }
      const updated = await res.json();
      // refresh detail view if open
      if (
        detailPost &&
        detailPost.post &&
        detailPost.post._id === updated.post
      ) {
        openDetails(updated.post);
      }
    } catch (err) {
      console.error("declineBid error", err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @media (max-width: 900px) {
          .buyer-layout { flex-direction: column; }
          .buyer-sidebar { width: 100% !important; position: relative; height: auto !important; }
          .buyer-main { padding: 12px !important; }
          form[style] { flex: 0 0 100% !important; }
        }
      `}</style>
      <div className="flex buyer-layout">
        {/* SIDEBAR copied from BuyerDashboard for consistent layout */}
        <aside className="w-72 bg-white border-r h-screen sticky top-0 buyer-sidebar">
          <div className="px-6 py-6 flex items-center gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                background: "#f1f5f9",
                borderRadius: 8,
              }}
            />
            <div>
              <h4 className="text-lg font-semibold">GreenBanana</h4>
              <p className="text-xs text-muted-foreground">Buyer Center</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e6eef6" }} />

          <nav className="px-4 py-6">
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/buyer/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/buyer/posts"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Yêu Cầu của tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/buyer/posts"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Báo giá đã nhận
                </Link>
              </li>
              <li>
                <Link
                  to="/buyer/orders"
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  Đơn hàng
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="buyer-main" style={{ flex: 1, padding: 20 }}>
          <h2 style={{ marginBottom: 12 }}>Đăng yêu cầu mua hàng</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <form
              onSubmit={createPost}
              style={{
                flex: "0 0 480px",
                background: "#fff",
                padding: 18,
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Sản phẩm
                </label>
                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8 }}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.cooperative?.username || p.cooperative} —{" "}
                      {p.pricePerUnit} VNĐ/kg
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Tiêu đề
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8 }}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 8 }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontWeight: 600 }}>
                    Số lượng
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontWeight: 600 }}>
                    Đơn giá mong muốn (VNĐ/kg)
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    value={form.unitPrice}
                    onChange={handleChange}
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600 }}>
                  Ngày mong muốn
                </label>
                <input
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  style={{ padding: 8 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#0ea5a4",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "none",
                }}
              >
                Gửi yêu cầu
              </button>
            </form>

            <div style={{ flex: 1 }}>
              <h3>Danh sách yêu cầu</h3>
              {loading ? (
                <p>Đang tải...</p>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {posts.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        background: "#fff",
                        padding: 14,
                        borderRadius: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.title}</div>
                        <div style={{ color: "#64748b" }}>
                          {p.quantity} —{" "}
                          {p.product
                            ? typeof p.product === "object"
                              ? p.product.name
                              : p.product
                            : ""}
                        </div>
                        <div style={{ marginTop: 6 }}>{p.description}</div>
                        {p.bids && p.bids.length > 0 && (
                          <div style={{ marginTop: 8, color: "#334155" }}>
                            HTX tham gia:{" "}
                            {p.bids
                              .map(
                                (b) => b.cooperative?.username || b.cooperative
                              )
                              .join(", ")}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ marginBottom: 8 }}>
                          {p.status === "open" && (
                            <Badge color="#059669">Mở</Badge>
                          )}
                          {p.status === "closed" && (
                            <Badge color="#334155">Đã đóng</Badge>
                          )}
                          {p.status === "cancelled" && (
                            <Badge color="#ef4444">Đã huỷ</Badge>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => openDetails(p._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: "1px solid #e2e8f0",
                              background: "#fff",
                            }}
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* details modal */}
          {detailPost && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setDetailPost(null)}
            >
              <div
                style={{
                  background: "#fff",
                  width: "90%",
                  maxWidth: 900,
                  borderRadius: 12,
                  padding: 18,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3>Chi tiết yêu cầu: {detailPost.post.title}</h3>
                  <button onClick={() => setDetailPost(null)}>Đóng</button>
                </div>
                <p>{detailPost.post.description}</p>
                <h4>Báo giá từ HTX</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                    gap: 12,
                  }}
                >
                  {detailPost.bids.length === 0 && <div>Chưa có báo giá</div>}
                  {detailPost.bids.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e6eef6",
                        borderRadius: 10,
                        padding: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>
                            {b.cooperative?.username || b.cooperative}
                          </div>
                          <div style={{ color: "#64748b" }}>
                            Giá: {b.price} — Số lượng: {b.quantity}
                          </div>
                          <div style={{ color: "#94a3b8", marginTop: 6 }}>
                            {b.notes}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ marginBottom: 8 }}>
                            {b.status === "pending" ? (
                              <Badge color="#f59e0b">Chờ</Badge>
                            ) : (
                              <Badge color="#0ea5a4">{b.status}</Badge>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexDirection: "column",
                            }}
                          >
                            <button
                              onClick={() => openAcceptConfirm(b._id)}
                              style={{
                                background: "#06b6d4",
                                color: "#fff",
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "none",
                              }}
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() => declineBid(b._id)}
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "none",
                              }}
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* confirm accept modal */}
          {confirmModal.open && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() =>
                setConfirmModal({ open: false, bidId: null, supplierId: null })
              }
            >
              <div
                style={{
                  background: "#fff",
                  width: "100%",
                  maxWidth: 520,
                  borderRadius: 12,
                  padding: 18,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: 8 }}>Xác nhận chấp nhận báo giá</h3>
                <p style={{ color: "#64748b" }}>
                  Chọn nhà cung cấp để tạo đơn hàng (SupplyOrder)
                </p>
                <div style={{ marginTop: 12 }}>
                  {suppliers.length === 0 ? (
                    <div style={{ color: "#ef4444" }}>
                      Không có nhà cung cấp nào. Hệ thống sẽ tạo nhà cung cấp
                      mặc định.
                    </div>
                  ) : (
                    <select
                      value={confirmModal.supplierId || ""}
                      onChange={(e) =>
                        setConfirmModal((s) => ({
                          ...s,
                          supplierId: e.target.value,
                        }))
                      }
                      style={{ width: "100%", padding: 8 }}
                    >
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.username} ({s._id.slice(0, 8)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() =>
                      setConfirmModal({
                        open: false,
                        bidId: null,
                        supplierId: null,
                      })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                    }}
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={async () => {
                      const ok = await acceptBid(
                        confirmModal.bidId,
                        confirmModal.supplierId
                      );
                      setConfirmModal({
                        open: false,
                        bidId: null,
                        supplierId: null,
                      });
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "#06b6d4",
                      color: "#fff",
                    }}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyerPosts;
