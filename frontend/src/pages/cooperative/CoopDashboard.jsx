import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const CoopDashboard = () => {
  const { user } = useAuth();
  const coopId = user?.data?._id || null;
  const [bids, setBids] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!coopId) return;
    const apiBase = import.meta.env.VITE_API_BASE || "/api";
    fetch(`${apiBase}/bids/coop/${coopId}`, {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : undefined,
      },
    })
      .then((r) => r.json())
      .then(setBids)
      .catch(console.error);
    fetch(`${apiBase}/inventory/coop/${coopId}`, {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : undefined,
      },
    })
      .then((r) => r.json())
      .then(setInventory)
      .catch(console.error);
  }, [coopId, user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Cooperative Dashboard</h2>

      <section style={{ marginTop: 16 }}>
        <h3>Your Bids</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Post</th>
                <th style={{ textAlign: "left", padding: 8 }}>Price</th>
                <th style={{ textAlign: "left", padding: 8 }}>Quantity</th>
                <th style={{ textAlign: "left", padding: 8 }}>ETA</th>
                <th style={{ textAlign: "left", padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b) => (
                <tr key={b._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{b.post?.title}</td>
                  <td style={{ padding: 8 }}>{b.price}</td>
                  <td style={{ padding: 8 }}>{b.quantity}</td>
                  <td style={{ padding: 8 }}>
                    {b.eta ? new Date(b.eta).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: 8 }}>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h3>Inventory</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Product</th>
                <th style={{ textAlign: "left", padding: 8 }}>SKU</th>
                <th style={{ textAlign: "left", padding: 8 }}>Quantity</th>
                <th style={{ textAlign: "left", padding: 8 }}>Unit</th>
                <th style={{ textAlign: "left", padding: 8 }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((i) => (
                <tr key={i._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{i.product?.name || i.product}</td>
                  <td style={{ padding: 8 }}>{i.sku}</td>
                  <td style={{ padding: 8 }}>{i.quantity}</td>
                  <td style={{ padding: 8 }}>{i.unit}</td>
                  <td style={{ padding: 8 }}>{i.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CoopDashboard;
