// components/layouts/OwnerLayout.jsx
import { Outlet } from "react-router-dom";
import OwnerSidebar from "../../components/navbar/OwnerSidebar";
import { OwnerCustomNavbar } from "../../components/navbar/OwnerCustomNavbar";

const OwnerLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar bên trái */}
      <OwnerSidebar />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar phía trên */}
        <OwnerCustomNavbar />

        {/* Nội dung trang */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
