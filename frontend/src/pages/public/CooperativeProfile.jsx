import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./HomePage.css";
import apiFetch from "../../utils/api";

const CooperativeProfile = () => {
  const { id } = useParams();
  const [coop, setCoop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoop = async () => {
      try {
        const data = await apiFetch(`/user/public/cooperatives/${id}`);
        setCoop(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoop();
  }, [id]);

  if (loading) return <div className="gb-inner">Loading...</div>;
  if (error) return <div className="gb-inner">Error: {error}</div>;
  if (!coop) return <div className="gb-inner">Không tìm thấy hợp tác xã</div>;

  return (
    <main className="gb-container">
      <div className="gb-inner">
        <Link to="/" className="gb-btn gb-btn-outline">
          ← Về trang chủ
        </Link>
        <div className="coop-profile">
          <div className="coop-profile-media">
            <img
              src={coop.photo || "/default-coop.png"}
              alt={coop.companyName}
            />
          </div>
          <div className="coop-profile-body">
            <h1>{coop.companyName}</h1>
            <p className="coop-address">{coop.address}</p>
            <p>
              <strong>Liên hệ:</strong> {coop.phone || "N/A"}
            </p>

            {coop.productTypes && coop.productTypes.length > 0 && (
              <div>
                <h3>Sản phẩm</h3>
                <ul className="coop-products">
                  {coop.productTypes.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="coop-meta">
              <p>
                <strong>Khả năng cung ứng:</strong>{" "}
                {coop.supplyCapacity || "N/A"}
              </p>
              <p>
                <strong>Khu vực giao hàng:</strong>{" "}
                {coop.deliveryAreas || "N/A"}
              </p>
              {coop.certifications && coop.certifications.length > 0 && (
                <p>
                  <strong>Chứng nhận:</strong> {coop.certifications.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CooperativeProfile;
