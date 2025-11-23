import React from "react";
import { Outlet } from "react-router-dom";
import "./PublicLayout.css";

const BuyerLayout = () => {
  return (
    <div className="public-layout">
      <main className="public-main">
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BuyerLayout;
