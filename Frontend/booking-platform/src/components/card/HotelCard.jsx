import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaBed, FaHeart } from "react-icons/fa";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import './HotelCard.css'

const HotelCard = ({ hotel, goToDetail, isFavorite, toggleFavorite }) => {

  const [rooms, setRooms] = useState([]);
  const [totalQuantityRoom, setTotalQuantityRoom] = useState();

  const fetchRoomByHotelId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/room/get-room-by-hotel/${hotel._id}`)
      if (response.data && response.data?.rooms) {
        setRooms(response.data?.rooms);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(`Danh sach room ${rooms}`)

  useEffect(() => {
    fetchRoomByHotelId();
  }, []);

  return (
    <Card className="shadow-sm border rounded-3">
      <Row className="g-0">
        {/* Left side image and favorite icon */}
        <Col md={4} className="position-relative">
          <div className="card-img-container" style={{
            height: "240px",
            overflow: "hidden",
            position: "relative",
            margin: "16px"
          }}>
            <Card.Img
              src={hotel.images[0] || "default_image_url"}
              className="img-fluid rounded-3"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0"
              }}
            />
            <div className="position-absolute top-0 end-0 m-3"
              style={{
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: '8px',
                borderRadius: '50%'
              }}
            >
              <FaHeart
                color={isFavorite ? "red" : "white"}
                size={24}
                onClick={() => addToFavorite()}
              />
            </div>
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
