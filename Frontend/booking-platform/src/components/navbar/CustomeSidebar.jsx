import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHotel,
  FaChevronDown,
  FaChevronRight,
  FaBuilding,
  FaCog,
} from "react-icons/fa";
import axiosInstance from "../utils/AxiosInstance";

export const Sidebar = ({ width, setWidth }) => {
  const [expandedHotels, setExpandedHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [userHotels, setUserHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOwnedHotels = async () => {
      try {
        setLoading(true);
        console.log("Token:", sessionStorage.getItem("token"));
        const response = await axiosInstance.get("/hotel/get-owned-hotel");
        console.log("API Response:", response.data);
        if (!response.data.error) {
          setUserHotels(response.data.hotels);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch hotels. Please try again.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedHotels();
  }, []);

  const handleHotelClick = (hotelId) => {
    if (selectedHotel === hotelId) {
      setSelectedHotel(null);
    } else {
      setSelectedHotel(hotelId);
      navigate(`/dashboard/hotels/${hotelId}`);
    }
  };

  const handleServiceClick = (hotelId, service) => {
    navigate(`/dashboard/hotels/${hotelId}/services/${service}`);
  };

  return (
    <div
      className="sidebar text-white"
      style={{
        width: `${width}px`,
        height: "100vh",
        position: "fixed",
        overflowY: "auto",
        transition: "width 0.3s",
        backgroundColor: "#6499E9",
      }}
    >
      <div className="p-3">
        <h5 className="text-center font-weight-bold">
          Hotel Managing Dashboard
        </h5>
        <hr />

        <div className="menu-items">
          <Link to="/dashboard" className="text-decoration-none">
            <div
              className="menu-item p-2 rounded mb-2 text-white"
              style={{
                backgroundColor:
                  location.pathname === "/dashboard"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "transparent",
                fontWeight:
                  location.pathname === "/dashboard" ? "bold" : "normal",
              }}
            >
              Dashboard Overview
            </div>
          </Link>

          <div
            className="menu-item p-2 rounded mb-2 text-white"
            onClick={() => setExpandedHotels(!expandedHotels)}
            style={{
              cursor: "pointer",
              backgroundColor: expandedHotels
                ? "rgba(0, 0, 0, 0.2)"
                : "transparent",
              fontWeight: expandedHotels ? "bold" : "normal",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaHotel className="me-2" />
                Hotel Management
              </div>
              {expandedHotels ? <FaChevronDown /> : <FaChevronRight />}
            </div>
          </div>

          {expandedHotels && (
            <div className="ms-3 mb-2">
              {loading ? (
                <div className="text-white">Loading hotels...</div>
              ) : error ? (
                <div className="text-white">{error}</div>
              ) : userHotels.length === 0 ? (
                <div className="text-white">No hotels found</div>
              ) : (
                userHotels.map((hotel) => (
                  <div key={hotel._id}>
                    <div
                      className="p-2 rounded hotel-item"
                      onClick={() => handleHotelClick(hotel._id)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedHotel === hotel._id
                            ? "rgba(0, 0, 0, 0.15)"
                            : "transparent",
                        fontWeight:
                          selectedHotel === hotel._id ? "bold" : "normal",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <FaBuilding className="me-2" />
                          {hotel.hotelName || "Unnamed Hotel"}{" "}
                          {/* Updated to hotelName */}
                        </div>
                        {selectedHotel === hotel._id ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </div>
                    </div>
                    {selectedHotel === hotel._id && (
                      <div className="ms-3">
                        {["rooms", "amenities", "offers"].map((service) => (
                          <div
                            key={service}
                            className="p-2 rounded service-item"
                            onClick={() =>
                              handleServiceClick(hotel._id, service)
                            }
                            style={{
                              cursor: "pointer",
                              backgroundColor: location.pathname.includes(
                                `/hotels/${hotel._id}/services/${service}`
                              )
                                ? "rgba(0, 0, 0, 0.1)"
                                : "transparent",
                              fontWeight: location.pathname.includes(
                                `/hotels/${hotel._id}/services/${service}`
                              )
                                ? "bold"
                                : "normal",
                            }}
                          >
                            <FaCog className="me-2" />
                            {service.charAt(0).toUpperCase() + service.slice(1)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
