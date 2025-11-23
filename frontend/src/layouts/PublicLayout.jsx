import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PublicLayout.css";

const PublicLayout = () => {
  return (
    
    <div className="public-layout">
      <Header />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
