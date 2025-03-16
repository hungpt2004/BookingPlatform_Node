import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaBed, FaHeart } from "react-icons/fa";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";

const HotelCard = ({ hotel, goToDetail, isFavorite, toggleFavorite }) => {
  // Define state variables to hold room data and total room quantity
  const [rooms, setRooms] = useState([]);
  const [totalQuantityRoom, setTotalQuantityRoom] = useState(0);

  const fetchRoomByHotelId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/room/get-room-by-hotel/${hotel._id}`);
      if (response.data && response.data.rooms) {
        setRooms(response.data.rooms);
        const totalQuantity = response.data.rooms.reduce((sum, room) => sum + room.quantity, 0);
        setTotalQuantityRoom(totalQuantity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRoomByHotelId();
  }, []);

  return (
    <Card className="shadow-sm border rounded-3">
      <Row className="g-0">
        {/* Left side image and favorite icon */}
        <Col md={4} className="position-relative">
          <Card.Img
            src={hotel.images || "default_image_url"}
            className="img-fluid round-0 p-3"
            style={{ objectFit: "cover", height: "100%" }}
          />
          <div className="position-absolute w-100 h-100 top-0 start-0"></div>
          <div
            className="position-absolute top-0 end-0 m-4"
            style={{
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: "8px",
              borderRadius: "50%"
            }}
          >
            <FaHeart
              color={isFavorite ? "red" : "white"}
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(hotel._id);
              }}
            />
          </div>
        </Col>

        {/* Right side content */}
        <Col md={8}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="fw-bold" style={{ color: "#003b95" }}>
                {hotel.hotelName}
              </Card.Title>
              <div style={{ backgroundColor: "#003b95", color: "white" }} className="fs-6 px-3 py-1 rounded-1 mb-2">
                {hotel.rating}
              </div>
            </div>
            <div className="text-muted">
              <FaMapMarkerAlt className="me-1" />
              <span className="fs-6">{hotel.address} km from centre</span>
            </div>

            <Badge bg="success">Limited-time Deal</Badge>

            <div className="mt-3">
              <span className="fw-bold">{rooms.length} types of Room</span>
              <div className="text-muted">
                <FaBed className="me-1 fs-6" /> Choose specific room in detail
              </div>
            </div>

            <div className="text-danger fw-bold fs-6 mt-2">
              Have {totalQuantityRoom} rooms left at this price!
            </div>

            <div className="d-flex align-items-center mt-2">
              <del className="text-muted me-2">{formatCurrencyVND(hotel.pricePerNight + 100)}</del>
              <h5 className="fw-bold text-dark">{formatCurrencyVND(hotel.pricePerNight)}</h5>
            </div>

            <Button
              style={{ backgroundColor: "#003b95", color: "white", borderColor: "#003b95" }}
              onClick={goToDetail}
              className="w-100 mt-3"
            >
              See availability
            </Button>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default HotelCard;
