import { useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaBed, FaHeart, FaThumbsUp } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

const HotelCard = ({ hotel, goToDetail, isFavorite, toggleFavorite }) => {

  return (
    <Card className="p-3 shadow-sm border rounded-3">
      <Row className="g-0">
        {/* Ảnh bên trái */}
        <Col md={4} className="position-relative">
          <Card.Img
            src={hotel.images || "default_image_url"}
            className="img-fluid rounded-3"
            style={{ objectFit: "cover", height: "100%" }}
          />
          <div
            className="position-absolute w-100 h-100 top-0 start-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)' // Kết hợp với màu tối
            }}
          ></div>
          <div
            className="position-absolute top-0 end-0 m-3"
            style={{
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              padding: '8px',
              borderRadius: '50%'
            }}
          >
            <FaHeart
              className=""
              color={isFavorite ? "red" : "white"}
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(hotel._id);
              }}
            />
          </div>
        </Col>

        {/* Nội dung bên phải */}
        <Col md={8}>
          <Card.Body>
            {/* Tên khách sạn + rating */}
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="fw-bold text-primary">
                {hotel.hotelName}
              </Card.Title>
              <Badge style={{ backgroundColor: '#003b95' }} className="fs-6">{hotel.rating} ⭐</Badge>
            </div>

            {/* Địa điểm + khoảng cách */}
            <div className="text-muted">
              <FaMapMarkerAlt className="me-1" />
              <span>{hotel.address} km from centre</span>
            </div>

            {/* Khuyến mãi */}
            <Badge bg="success" className="mt-2">Limited-time Deal</Badge>

            {/* Loại phòng */}
            <div className="mt-2">
              <span className="fw-bold">Superior Double Room</span>
              <div className="text-muted">
                <FaBed className="me-1" /> 1 double bed
              </div>
            </div>

            {/* Cảnh báo số lượng phòng */}
            <div className="text-danger fw-bold mt-1">
              Only 1 rooms left at this price!
            </div>

            {/* Giá phòng */}
            <div className="d-flex align-items-center mt-2">
              <del className="text-muted me-2">VND {hotel.pricePerNight + 100}</del>
              <h5 className="fw-bold text-dark">VND {hotel.pricePerNight}</h5>
            </div>

            {/* Nút xem phòng */}
            <Button variant="primary" onClick={goToDetail} className="w-100 mt-4">See availability</Button>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default HotelCard