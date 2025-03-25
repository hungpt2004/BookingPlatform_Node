// components/layouts/OwnerLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/navbar/OwnerSidebar";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import AdminSideBar from "../../components/navbar/AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar bên trái */}
      <AdminSideBar />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar phía trên */}
        <AdminCustomNavbar />

        {/* Nội dung trang */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
