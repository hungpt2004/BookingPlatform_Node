import React, { useState, useEffect } from "react";
import { Card, Container, Alert, Row, Col, Spinner, Badge, ProgressBar } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import "chart.js/auto";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import axiosInstance from "../../utils/AxiosInstance";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import Sidebar from "../../components/navbar/CustomeSidebar";
import AdminSidebar from "../../components/navbar/AdminSidebar"
import axios from "axios";

// Dashboard Overview Component
const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalReservations: 0,
    revenue: 0,
    activeHotels: 0,
    successBooking: 0,
    pendingBookings: 0,
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("yearly");

  //Get data of hotel ownner
  useEffect(() => {
    const fetchOwnerHotel = async () => {
      try {

        const response = await axiosInstance.get('/hotel/get-owned-hotel')
        if (response.data && response.data.hotels) {

        }
      } catch (error) {

      }
    }
  })


  //Get data chart dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance("/monthly-payment");
        if (response.data) {
          setDashboardData({
            totalReservations: response.data.totalReservationAmount,
            revenue: formatCurrencyVND(response.data.totalRevenue),
            activeHotels: response.data.activeHotel,
            successBooking: response.data.normalReservations,
            pendingBookings: response.data.cancelReservation,
            revenueData: response.data.averageMonthlyRevenue,
          });
        }
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to load dashboard data", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: dashboardData.revenueData,
        borderColor: "#0071c2",
        backgroundColor: "rgba(0, 113, 194, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0071c2",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Revenue: ${formatCurrencyVND(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Calculate success rate
  const successRate = dashboardData.totalReservations > 0
    ? Math.round((dashboardData.successBooking / dashboardData.totalReservations) * 100)
    : 0;

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    </div>
  );

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="content w-100">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-0 fw-bold">Dashboard Overview</h2>
              <p className="text-muted">Nơi này sẽ giúp quản lý doanh thu của bạn</p>
            </div>
            <div className="d-flex gap-2">
              <select
                className="form-select form-select-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ width: "120px" }}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-download me-1"></i> Export
              </button>
            </div>
          </div>

          <Row className="g-4 mb-4">
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Tổng Hóa Đơn</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", backgroundColor: "rgba(0, 113, 194, 0.1)" }}>
                      <i className="bi bi-calendar-check fs-5 text-primary"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0">{dashboardData.totalReservations}</h3>
                  <div className="d-flex align-items-center mt-3">
                    <span className="badge bg-success me-2">+5.2%</span>
                    <small className="text-muted">from last period</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Tổng doanh thu</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", backgroundColor: "rgba(25, 135, 84, 0.1)" }}>
                      <i className="bi bi-currency-dollar fs-5 text-success"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0">{dashboardData.revenue}</h3>
                  <div className="d-flex align-items-center mt-3">
                    <span className="badge bg-success me-2">+8.4%</span>
                    <small className="text-muted">from last period</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Success Bookings</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", backgroundColor: "rgba(13, 110, 253, 0.1)" }}>
                      <i className="bi bi-check-circle fs-5 text-primary"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0">{dashboardData.successBooking}</h3>
                  <div className="mt-3">
                    <ProgressBar now={successRate} variant="primary" className="mb-2" style={{ height: "6px" }} />
                    <small className="text-muted">{successRate}% success rate</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">Pending Bookings</div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", backgroundColor: "rgba(255, 193, 7, 0.1)" }}>
                      <i className="bi bi-hourglass-split fs-5 text-warning"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0">{dashboardData.pendingBookings}</h3>
                  <div className="d-flex align-items-center mt-3">
                    <Badge bg={dashboardData.pendingBookings > 10 ? "warning" : "success"} className="me-2">
                      {dashboardData.pendingBookings > 10 ? "Needs Attention" : "Normal"}
                    </Badge>
                    <small className="text-muted">
                      {dashboardData.pendingBookings > 10 ? "Higher than usual" : "Within normal range"}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Revenue Overview</h5>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary active">Monthly</button>
                      <button className="btn btn-outline-secondary">Quarterly</button>
                      <button className="btn btn-outline-secondary">Yearly</button>
                    </div>
                  </div>
                  <div style={{ height: "350px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Active Hotels</h5>
                    <Badge bg="primary" pill>{dashboardData.activeHotels}</Badge>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Hotel Name</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Occupancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Grand Hotel</td>
                          <td>Ho Chi Minh City</td>
                          <td><Badge bg="success">Active</Badge></td>
                          <td>87%</td>
                        </tr>
                        <tr>
                          <td>Seaside Resort</td>
                          <td>Da Nang</td>
                          <td><Badge bg="success">Active</Badge></td>
                          <td>92%</td>
                        </tr>
                        <tr>
                          <td>Mountain View</td>
                          <td>Da Lat</td>
                          <td><Badge bg="success">Active</Badge></td>
                          <td>78%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Recent Activities</h5>
                    <button className="btn btn-sm btn-link">View All</button>
                  </div>
                  <div className="timeline">
                    {[
                      { time: "2 hours ago", text: "New booking received for Grand Hotel", type: "success" },
                      { time: "5 hours ago", text: "Payment confirmed for reservation #38291", type: "primary" },
                      { time: "Yesterday", text: "Booking canceled for Mountain View Hotel", type: "danger" },
                      { time: "2 days ago", text: "New hotel added to the system", type: "info" },
                    ].map((activity, index) => (
                      <div key={index} className="d-flex mb-3">
                        <div className={`bg-${activity.type} rounded-circle me-3`} style={{ width: "10px", height: "10px", marginTop: "6px" }}></div>
                        <div>
                          <div className="fw-medium">{activity.text}</div>
                          <div className="text-muted small">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;