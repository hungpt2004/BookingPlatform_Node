import React, { useState, useEffect } from "react";
import { Card, Container, Alert, Form, InputGroup } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import { Sidebar } from "../../components/navbar/CustomeSidebar";
import { FaBars, FaSearch } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

// Dashboard Overview Component
const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalReservations: 0,
    revenue: 0,
    activeHotels: 0,
    pendingBookings: 0,
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from an API
        // For now, we'll simulate a successful API response with sample data
        setDashboardData({
          totalReservations: 1450,
          revenue: 45670,
          activeHotels: 3,
          pendingBookings: 24,
          revenueData: [1200, 1900, 3000, 5000, 2300, 3400],
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: dashboardData.revenueData,
        borderColor: "#6499E9", // Primary brand color
        backgroundColor: "rgba(100, 153, 233, 0.1)",
        fill: true,
      },
    ],
  };

  if (loading)
    return <div className="p-5 text-center">Loading dashboard data...</div>;

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  return (
    <>
      <div className="row px-5 mx-5 mb-5 mt-4">
        {[
          {
            title: "Total Reservations",
            value: dashboardData.totalReservations.toLocaleString(),
          },
          {
            title: "Revenue",
            value: `$${dashboardData.revenue.toLocaleString()}`,
          },
          { title: "Active Hotels", value: dashboardData.activeHotels },
          { title: "Pending Bookings", value: dashboardData.pendingBookings },
        ].map((item, index) => (
          <div key={index} className="col-md-3">
            <Card className="shadow-lg mb-1">
              <Card.Header
                className="text-center text-white mb-1 fw-bold fs-5"
                style={{ backgroundColor: "#6499E9" }}
              >
                {item.title}
              </Card.Header>
              <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
                <Card.Text className="text-center fs-4">{item.value}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Container>
        <h4 className="mb-3">Revenue Overview</h4>
        <Line data={chartData} />
      </Container>
    </>
  );
};

// Hotel Overview Component
const HotelOverview = () => {
  const { hotelId } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const sampleData = {
          1: { name: "Grand Hotel", rooms: 120, occupancyRate: 75 },
          2: { name: "Seaside Resort", rooms: 85, occupancyRate: 82 },
          3: { name: "Mountain Lodge", rooms: 45, occupancyRate: 68 },
        };

        setHotelData(
          sampleData[hotelId] || {
            name: "Unknown Hotel",
            rooms: 0,
            occupancyRate: 0,
          }
        );
        setLoading(false);
      } catch (err) {
        setError(`Failed to load hotel #${hotelId} data`);
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  if (loading)
    return <div className="p-5 text-center">Loading hotel data...</div>;

  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );

  if (!hotelData)
    return (
      <Alert variant="warning" className="m-4">
        Hotel not found
      </Alert>
    );

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Occupancy Rate %",
        data: [65, 70, 80, 75, 85, hotelData.occupancyRate],
        borderColor: "#9EDDFF", // Secondary brand color
        backgroundColor: "rgba(158, 221, 255, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h3>{hotelData.name} Overview</h3>
      <div className="row mb-4 mt-3">
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Header
              className="text-white"
              style={{ backgroundColor: "#6499E9" }}
            >
              Rooms
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
              <h3 className="text-center">{hotelData.rooms}</h3>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Header
              className="text-white"
              style={{ backgroundColor: "#6499E9" }}
            >
              Occupancy Rate
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
              <h3 className="text-center">{hotelData.occupancyRate}%</h3>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Header
              className="text-white"
              style={{ backgroundColor: "#6499E9" }}
            >
              Active Bookings
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
              <h3 className="text-center">
                {Math.floor((hotelData.rooms * hotelData.occupancyRate) / 100)}
              </h3>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Container>
        <h4 className="mb-3">Occupancy Trend</h4>
        <Line data={chartData} />
      </Container>
    </div>
  );
};

// Service Management Component - Now with search and sequential IDs
const ServiceManagement = () => {
  const { hotelId, serviceType } = useParams();
  const [services, setServices] = useState([]);
  const [displayServices, setDisplayServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch services from API based on hotel ID
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/hotel-service/get-all-hotel-services/${hotelId}`
        );

        if (response.data && response.data.hotelServices) {
          // Filter services based on service type if needed
          // This depends on how your backend structures the data
          const filteredServices = response.data.hotelServices.filter(
            (service) => service.type === serviceType || !service.type
          );

          // Assign sequential display IDs
          const servicesWithDisplayIds = filteredServices.map(
            (service, index) => ({
              ...service,
              displayId: index + 1,
            })
          );

          setServices(servicesWithDisplayIds);
          setDisplayServices(servicesWithDisplayIds);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.response?.data?.message || "Failed to load services");
        setLoading(false);
      }
    };

    fetchServices();
  }, [hotelId, serviceType]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setDisplayServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Re-assign sequential display IDs
      const filteredWithIds = filtered.map((service, index) => ({
        ...service,
        displayId: index + 1,
      }));

      setDisplayServices(filteredWithIds);
    }
  }, [searchTerm, services]);

  // Function to update display IDs after operations
  const updateDisplayIds = (servicesList) => {
    return servicesList.map((service, index) => ({
      ...service,
      displayId: index + 1,
    }));
  };

  const handleAddService = async () => {
    if (newService.name.trim() === "") return;

    try {
      setLoading(true);

      if (isEditing) {
        // Update existing service
        await axiosInstance.patch(
          `/hotel-service/update-hotel-service/${currentId}`,
          {
            name: newService.name,
            description: newService.description,
            price: newService.price,
          }
        );

        // Update the service in state
        const updatedServices = services.map((service) =>
          service._id === currentId
            ? {
                ...service,
                name: newService.name,
                description: newService.description,
                price: newService.price,
              }
            : service
        );

        // Re-assign sequential display IDs
        const servicesWithUpdatedIds = updateDisplayIds(updatedServices);

        setServices(servicesWithUpdatedIds);
        setDisplayServices(
          searchTerm.trim() === ""
            ? servicesWithUpdatedIds
            : updateDisplayIds(
                servicesWithUpdatedIds.filter(
                  (service) =>
                    service.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    service.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
              )
        );

        setSuccess("Service updated successfully");
        setIsEditing(false);
        setCurrentId(null);
      } else {
        // Add new service
        const response = await axiosInstance.post(
          `/hotel-service/create-hotel-service/${hotelId}`,
          {
            name: newService.name,
            description: newService.description,
            price: newService.price,
            type: serviceType, // You might need to add this if your backend requires it
          }
        );

        // Refresh the services list after adding
        const updatedResponse = await axiosInstance.get(
          `/hotel-service/get-all-hotel-services/${hotelId}`
        );
        const filteredServices = updatedResponse.data.hotelServices.filter(
          (service) => service.type === serviceType || !service.type
        );

        // Re-assign sequential display IDs
        const servicesWithDisplayIds = updateDisplayIds(filteredServices);

        setServices(servicesWithDisplayIds);
        setDisplayServices(
          searchTerm.trim() === ""
            ? servicesWithDisplayIds
            : updateDisplayIds(
                servicesWithDisplayIds.filter(
                  (service) =>
                    service.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    service.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
              )
        );

        setSuccess("Service added successfully");
      }

      // Reset form
      setNewService({ name: "", description: "", price: "" });
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving service:", err);
      setError(err.response?.data?.message || "Failed to save service");
      setLoading(false);

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditService = (service) => {
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setIsEditing(true);
    setCurrentId(service._id);
  };

  const handleDeleteService = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/hotel-service/delete-hotel-service/${id}`);

      // Update services state without the deleted item
      const updatedServices = services.filter((service) => service._id !== id);

      // Re-assign sequential display IDs
      const servicesWithUpdatedIds = updateDisplayIds(updatedServices);

      setServices(servicesWithUpdatedIds);
      setDisplayServices(
        searchTerm.trim() === ""
          ? servicesWithUpdatedIds
          : updateDisplayIds(
              servicesWithUpdatedIds.filter(
                (service) =>
                  service.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  service.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
            )
      );

      setSuccess("Service deleted successfully");
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting service:", err);
      setError(err.response?.data?.message || "Failed to delete service");
      setLoading(false);

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const capitalizedServiceType =
    serviceType.charAt(0).toUpperCase() + serviceType.slice(1);

  return (
    <div className="p-4">
      <h3>
        {capitalizedServiceType} Management for Hotel #{hotelId}
      </h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header
          className="text-white"
          style={{ backgroundColor: "#6499E9" }}
        >
          {isEditing
            ? `Edit ${capitalizedServiceType}`
            : `Add New ${capitalizedServiceType}`}
        </Card.Header>
        <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="col-md-2">
              <button
                className="w-100 text-white"
                style={{
                  backgroundColor: isEditing ? "#4a86d1" : "#6499E9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "4px",
                }}
                onClick={handleAddService}
                disabled={loading}
              >
                {loading ? "Processing..." : isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Search Box */}
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text
            style={{ backgroundColor: "#6499E9", color: "white" }}
          >
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder={`Search ${capitalizedServiceType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </InputGroup>
      </div>

      {loading && <div className="text-center p-3">Loading services...</div>}

      <table className="table table-hover">
        <thead style={{ backgroundColor: "#6499E9", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayServices.map((service) => (
            <tr key={service._id} style={{ backgroundColor: "#f0f9ff" }}>
              <td>{service.displayId}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>${service.price}</td>
              <td>
                <button
                  className="btn btn-sm me-2 text-white"
                  style={{ backgroundColor: "#4a86d1" }}
                  onClick={() => handleEditService(service)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#ff6b6b" }}
                  onClick={() => handleDeleteService(service._id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {displayServices.length === 0 && !loading && (
            <tr>
              <td colSpan="5" className="text-center">
                {searchTerm
                  ? `No ${serviceType} found matching '${searchTerm}'`
                  : `No ${serviceType} found`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Main Dashboard Page Component
const DashboardPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar width={sidebarWidth} setWidth={setSidebarWidth} />

      <div
        className="content flex-grow-1"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s",
          backgroundColor: "#ffffff", // Clean white background for main content
        }}
      >
        <AdminCustomNavbar />

        {/* Nested Routes */}
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/hotels/:hotelId" element={<HotelOverview />} />
          <Route
            path="/hotels/:hotelId/services/:serviceType"
            element={<ServiceManagement />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
