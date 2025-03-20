"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button, Modal, Badge } from "react-bootstrap"
import { Heart, Star, MapPin, Phone, Globe, Calendar } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./FavoriteListPage.css"
import { formatCurrencyVND } from "../../utils/FormatPricePrint"
import CustomNavbar from "../../components/navbar/CustomNavbar"
import axiosInstance from "../../utils/AxiosInstance"
import { useNavigate } from "react-router-dom"


function HotelCard({ hotel, onClick }) {
  return (
    <Card className="hotel-card mb-4 h-100">
      <Card.Img variant="top" src={hotel.images[0]} 
      className="position-relative"
      style={{
        width: '100%',
        height: '550px'
      }} alt={hotel.hotelName} />
      <Button className="position-absolute right-0 top-1">Delete</Button>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title>{hotel.hotelName}</Card.Title>
          <Heart className="favorite-icon" size={20} fill="#ff6b6b" />
        </div>
        <div className="d-flex align-items-center mb-2">
          <MapPin size={16} className="me-1 text-secondary" />
          <small className="text-muted">{hotel.address}</small>
        </div>
        <div className="d-flex align-items-center mb-3">
          <Star size={16} className="me-1 text-warning" fill="#ffc107" />
          <span className="me-2">{hotel.rating}</span>
          <span className="price-tag ms-auto">{formatCurrencyVND(hotel.pricePerNight)}/đêm</span>
        </div>
        <Button variant="primary" className="w-100" onClick={() => onClick(hotel)}>
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  )
}

function HotelDetailModal({ show, hotel, onHide, onNavigate }) {

  if (!hotel) return null

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{hotel.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <img style={{
              width: '100%',
              height: '500px'
            }} src={hotel.images[0] || "/placeholder.svg"} alt={hotel.hotelName} className="img-fluid rounded mb-3" />
            <div className="d-flex align-items-center mb-2">
              <MapPin size={18} className="me-2 text-primary" />
              <span>{hotel.address}</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Star size={18} className="me-1 text-warning" fill="#ffc107" />
              <span className="me-2">{hotel.rating}</span>
              <Badge bg="primary" className="ms-auto">
                {formatCurrencyVND(hotel.pricePerNight)}/đêm
              </Badge>
            </div>
          </Col>
          <Col md={6}>
            <h5>Về khách sạn</h5>
            <p>{hotel.description}</p>

            <h5 className="mt-3">Các dịch vụ của khách sạn</h5>
            <div className="amenities-container">
              {hotel.services.map((amenity, index) => (
                <Badge bg="light" text="dark" key={index} className="me-2 mb-2 p-2">
                  {amenity.name}
                </Badge>
              ))}
            </div>

            <h5 className="mt-3">Liên hệ</h5>
            <div className="d-flex align-items-center mb-2">
              <Phone size={16} className="me-2 text-primary" />
              <span>{hotel.phoneNumber}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Globe size={16} className="me-2 text-primary" />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button variant="primary" onClick={() => onNavigate(hotel._id)}>
          <Calendar size={16} className="me-2" />
          Đặt ngay
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function FavoriteListPage() {
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [listHotels, setListHotels] = useState([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const getDataFavoriteHotel = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/favorite/get-all-favorite`);

      console.log(response.data)

      if (response.data && response.data.favorites) {
        setListHotels(response.data.favorites);
      }

    } catch (error) {
      if (error.response.data.message) {
        console.log(error.reponse.data.message);
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

  }

  useEffect(() => {
    getDataFavoriteHotel();
  }, [])

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleNavigate = (hotelId) => {
    navigate(`/hotel-detail/${hotelId}`);
  }


  return (
    <>
      <CustomNavbar/>
      <Container className="py-5 mt-5">
      <h1 className="mb-4 text-center">Danh sách khách sạn yêu thích của tôi</h1>
      <p className="text-center text-muted mb-5">Bấm vào để xem thông tin khách sạn</p>

      <Row>
        {listHotels.map((hotel) => (
          <Col key={hotel.id} xs={12} sm={6} lg={4}>
            <HotelCard hotel={hotel} onClick={handleHotelClick} />
          </Col>
        ))}
      </Row>

      <HotelDetailModal show={showModal} hotel={selectedHotel} onHide={handleCloseModal} onNavigate={handleNavigate}/>
    </Container>
    </>
  )
}

export default FavoriteListPage

