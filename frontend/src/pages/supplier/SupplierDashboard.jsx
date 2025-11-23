import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || "/api";
    fetch(`${apiBase}/bids`, {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : undefined,
      },
    })
      .then((r) => r.json())
      .then((data) => setBids(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>Supplier — All Cooperative Bids</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            className="table-auto w-full"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Post</th>
                <th style={{ textAlign: "left", padding: 8 }}>Cooperative</th>
                <th style={{ textAlign: "left", padding: 8 }}>Price</th>
                <th style={{ textAlign: "left", padding: 8 }}>Quantity</th>
                <th style={{ textAlign: "left", padding: 8 }}>ETA</th>
                <th style={{ textAlign: "left", padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b) => (
                <tr key={b._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{b.post?.title || b.post}</td>
                  <td style={{ padding: 8 }}>
                    {b.cooperative?.username || b.cooperative}
                  </td>
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
      )}
    </div>
  );
};

export default SupplierDashboard;
