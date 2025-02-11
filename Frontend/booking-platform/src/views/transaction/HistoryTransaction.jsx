import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/Constant";
import axios from "axios";
import { HashLoader } from "react-spinners";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Pagination, Row } from "react-bootstrap";
import "./HistoryTransaction.css";
import { Badge, Button, Card } from "react-bootstrap";
import { formatDate } from "../../utils/FormatDatePrint";
import { dataStatus, statusColors, statusText } from "./DataStatus";
import FeedbackModal from "../../components/feedback/Feedback";
export const HistoryTransaction = () => {
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [err, setErr] = useState("");
  const [hotels, setHotels] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Thêm state tổng số trang
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState (null);
  const[getHotel, setGetHotel] = useState(null);
  const handleChangeStatus = (newStatus) => {
    setStatus(newStatus);
    setActiveStatus(newStatus);
    setPage(1); // Reset về trang đầu khi thay đổi trạng thái
  };

  const fetchDataReservation = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/reservation/search-status`,
        {
          params: { status, page },
        }
      );

      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations);
        setTotalPages(response.data.totalPages || 1);
        setErr("");
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const fetchHotelFromReservation = async (reservationId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/reservation/hotel/${reservationId}`
      );
      if (response.data && response.data.hotel) {
        return response.data.hotel; // Return the hotel data
      }
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    // Fetch hotels for all reservations after fetching reservation data
    const fetchHotels = async () => {
      const hotelData = {};
      for (let reservation of reservations) {
        const hotel = await fetchHotelFromReservation(reservation._id);
        if (hotel) {
          hotelData[reservation._id] = hotel; // Store hotel data by reservationId
        }
      }
      setHotels(hotelData);
    };
    if (reservations.length > 0) {
      fetchHotels();
    }
  }, [reservations]);

  useEffect(() => {
    fetchDataReservation();
  }, [status, page]);

  return (
    <>
      <CustomNavbar />
      <div className="row mt-5 d-flex container-fluid justify-content-center align-items-start">
        <div className="col-md-2">
          <div className="d-flex mt-5 flex-column" style={{ color: "red" }}>
            {dataStatus.map((item, index) => (
              <div key={index} className="col-md-1 p-2">
                <button
                  className={
                    activeStatus === item ? "btn-active" : "btn-non-active"
                  }
                  onClick={() => handleChangeStatus(item)}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-center align-items-center">
            {loading ? (
              <HashLoader className="mt-5" size={50} color="#6499E9" />
            ) : (
              <>
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                      <Pagination.Prev
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      />
                      {[...Array(totalPages)].map((_, index) => {
                        return (
                          <Pagination.Item
                            key={index + 1}
                            active={page === index + 1}
                            onClick={() => setPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        );
                      })}
                      <Pagination.Next
                        disabled={page === totalPages}
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                      />
                    </Pagination>
                  </div>
                  <div className="row">
                    {reservations.map((item, index) => {
                      const hotel = hotels[item._id]; // Get hotel by reservationId
                      return (
                        <div
                          key={index}
                          className={`
                                    ${reservations.length === 1
                              ? "col-md-12"
                              : reservations.length === 2
                                ? "col-md-6"
                                : "col-md-4"
                            }`}
                        >
                          <Card className="card-search-hotel p-3 m-3">
                            <Card.Title className="text-center">
                              {hotel.hotelName || "Unknown Hotel"}
                            </Card.Title>
                            <Card.Body>
                              <p>📍 Address: {hotel.address || "N/A"}</p>
                              <p>
                                🗓️ Check In Date:{" "}
                                {formatDate(item.checkInDate, "DD/MM/YYYY")}
                              </p>
                              <p>
                                🗓️ Check Out Date:{" "}
                                {formatDate(item.checkOutDate, "DD/MM/YYYY")}
                              </p>
                              <p>💰 Price: {item.totalPrice}$</p>
                              <Badge
                                className="badge-status py-2 px-3"
                                bg={statusColors[item.status]}
                              >
                                {statusText[item.status] || "Unknown Status"}
                              </Badge>
                            </Card.Body>
                            <Row className="m-2">
                              {item.status === "CHECKED OUT" && (
                                <Button
                                  className="mb-1"
                                  variant="outline-primary"
                                  onClick={() => {
                                    setShowFeedback(true)
                                    setSelectedReservationId(item._id);
                                    setGetHotel(hotel._id);
                                    console.log("reservation", item._id);
                                    console.log("hotel", hotel._id);
                                  }}
                                >
                                  Feedback
                                </Button>
                              )}
                              {item.status === "BOOKED" && (
                                <Button
                                  className="mb-1"
                                  variant="outline-danger"
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button className="" variant="outline-dark">
                                View Details
                              </Button>

                            </Row>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <p>{err}</p>
          </div>
        </div>
      </div >
      {/* Gọi modal */}
      <FeedbackModal
        show={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          setSelectedReservationId(null);
          setGetHotel(null);
          // Add this prop
        }}
        reservationId={selectedReservationId}
        getHotel={getHotel}
      />
    </>
  );
};
