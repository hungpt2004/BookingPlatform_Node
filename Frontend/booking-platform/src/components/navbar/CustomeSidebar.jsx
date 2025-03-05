import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { FaTachometerAlt, FaHotel, FaBox, FaCog } from "react-icons/fa";

export const Sidebar = ({ width, setWidth }) => {
   const [isResizing, setIsResizing] = useState(false);

   const handleMouseDown = (e) => {
      setIsResizing(true);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
   };

   const handleMouseMove = (e) => {
      if (isResizing) {
         const newWidth = Math.max(200, Math.min(400, e.clientX));
         setWidth(newWidth);
      }
   };

   const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
   };

   return (
      <>
         <div
            className="vh-100 position-fixed top-0 start-0 text-white p-3"
            style={{
               backgroundColor: "#003b95",
               width: `${width}px`,
               transition: isResizing ? "none" : "width 0.2s",
               zIndex: 1050,
               overflowX: "hidden",
               display: "flex",
               flexDirection: "column",
               justifyContent: "space-between",
            }}
         >
            <Nav className="flex-column gap-3 ">
            <h4 className="fw-bold mb-4">Owner Management</h4>
               <Nav.Link href="#" className="text-dark d-flex align-items-center bg-light rounded-3 py-3 mb-2">
                  <FaTachometerAlt className="me-2" /> Dashboard
               </Nav.Link>
               <Nav.Link href="#" className="text-white">
                  <FaHotel className="me-2" /> Management Hotel
               </Nav.Link>
               <Nav.Link href="#" className="text-white">
                  <FaBox className="me-2" /> Products
               </Nav.Link>
               <Nav.Link href="#" className="text-white">
                  <FaCog className="me-2" /> Settings
               </Nav.Link>
            </Nav>

            <div className="text-center small text-secondary">&copy; 2024 Owner Dashboard</div>

            {/* Thanh kéo sidebar */}
            <div
               className="position-absolute top-0 end-0 h-100"
               style={{
                  width: "10px",
                  cursor: "ew-resize",
                  backgroundColor: "lightgray",
               }}
               onMouseDown={handleMouseDown}
            />
         </div>
      </>
   );
};
