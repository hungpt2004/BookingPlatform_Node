import React, { useState } from "react";
import { Card, Container } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import { Sidebar } from "../../components/navbar/CustomeSidebar";
import { FaBars } from "react-icons/fa";

const DashboardPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 3000, 5000, 2300, 3400],
        borderColor: "#003b95",
        fill: true,
      },
    ],
  };
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar width={sidebarWidth} setWidth={setSidebarWidth} />

      <div className="content flex-grow-1" style={{ marginLeft: sidebarWidth, transition: "margin-left 0.3s" }}>
        <AdminCustomNavbar />

        <div className="row px-5 mx-5 mb-5">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="col-md-3">
              <Card className="shadow-lg mb-1">
                <Card.Header className="text-center text-white mb-1 fw-bold fs-5" style={{ backgroundColor: "#003b95" }}>
                  Total Reservation
                </Card.Header>
                <Card.Body>
                  <Card.Text className="text-center">1.450</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        <Container>
          <Line data={chartData} />
        </Container>
      </div>
    </div>
  );
};

export default DashboardPage;
