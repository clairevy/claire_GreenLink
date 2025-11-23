// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Đang loading thì hiển thị spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu không có quyền, chuyển về trang dashboard phù hợp với role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // Cho phép truy cập
  return children || <Outlet />;
};

export default PrivateRoute;
