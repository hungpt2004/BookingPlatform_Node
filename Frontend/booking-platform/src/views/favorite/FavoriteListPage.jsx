"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Button, Modal, Badge } from "react-bootstrap"
import { Heart, Star, MapPin, Phone, Globe, Calendar } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./FavoriteListPage.css"
import axios from "axios"
import { BASE_URL } from "../../utils/Constant"

// Mock data for hotels
const hotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York City, USA",
    rating: 4.8,
    price: "$250",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Luxury hotel in the heart of Manhattan with stunning views of Central Park. Features include a rooftop pool, spa, and 3 restaurants.",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Room Service"],
    contact: {
      phone: "+1 212-555-1234",
      email: "info@grandplaza.com",
      website: "www.grandplazahotel.com",
    },
  },
  {
    id: 2,
    name: "Seaside Resort & Spa",
    location: "Miami Beach, USA",
    rating: 4.6,
    price: "$320",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Beachfront resort with private access to Miami Beach. Enjoy our world-class spa, infinity pool, and oceanview rooms.",
    amenities: ["Beachfront", "Spa", "Pool", "Free WiFi", "Restaurant", "Bar"],
    contact: {
      phone: "+1 305-555-6789",
      email: "reservations@seasideresort.com",
      website: "www.seasideresort.com",
    },
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Aspen, Colorado, USA",
    rating: 4.9,
    price: "$400",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Cozy mountain retreat with ski-in/ski-out access. Featuring fireplaces in every room and panoramic mountain views.",
    amenities: ["Ski Access", "Fireplace", "Hot Tub", "Restaurant", "Bar", "Free WiFi"],
    contact: {
      phone: "+1 970-555-4321",
      email: "stay@mountainviewlodge.com",
      website: "www.mountainviewlodge.com",
    },
  },
  {
    id: 4,
    name: "Desert Oasis Resort",
    location: "Phoenix, Arizona, USA",
    rating: 4.5,
    price: "$180",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Tranquil desert retreat with stunning red rock views. Features include a golf course, spa treatments, and desert excursions.",
    amenities: ["Golf Course", "Spa", "Pool", "Restaurant", "Free WiFi", "Hiking Trails"],
    contact: {
      phone: "+1 480-555-7890",
      email: "info@desertoasis.com",
      website: "www.desertoasisresort.com",
    },
  },
  {
    id: 5,
    name: "City Lights Boutique Hotel",
    location: "Chicago, USA",
    rating: 4.7,
    price: "$220",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Stylish boutique hotel in downtown Chicago. Walking distance to major attractions, shopping, and dining.",
    amenities: ["Free WiFi", "Restaurant", "Bar", "Fitness Center", "Business Center"],
    contact: {
      phone: "+1 312-555-2345",
      email: "hello@citylightshotel.com",
      website: "www.citylightshotel.com",
    },
  },
  {
    id: 6,
    name: "Tropical Paradise Resort",
    location: "Honolulu, Hawaii, USA",
    rating: 4.9,
    price: "$450",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Luxurious beachfront resort on Waikiki Beach with traditional Hawaiian hospitality and stunning ocean views.",
    amenities: ["Beachfront", "Pool", "Spa", "Restaurant", "Water Sports", "Cultural Activities"],
    contact: {
      phone: "+1 808-555-8765",
      email: "aloha@tropicalparadise.com",
      website: "www.tropicalparadiseresort.com",
    },
  },
]

function HotelCard({ hotel, onClick }) {
  return (
    <Card className="hotel-card mb-4 h-100">
      <Card.Img variant="top" src={hotel.image} alt={hotel.name} />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title>{hotel.name}</Card.Title>
          <Heart className="favorite-icon" size={20} fill="#ff6b6b" />
        </div>
        <div className="d-flex align-items-center mb-2">
          <MapPin size={16} className="me-1 text-secondary" />
          <small className="text-muted">{hotel.location}</small>
        </div>
        <div className="d-flex align-items-center mb-3">
          <Star size={16} className="me-1 text-warning" fill="#ffc107" />
          <span className="me-2">{hotel.rating}</span>
          <span className="price-tag ms-auto">{hotel.price}/night</span>
        </div>
        <Button variant="primary" className="w-100" onClick={() => onClick(hotel)}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  )
}

function HotelDetailModal({ show, hotel, onHide }) {

  if (!hotel) return null

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{hotel.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="img-fluid rounded mb-3" />
            <div className="d-flex align-items-center mb-2">
              <MapPin size={18} className="me-2 text-primary" />
              <span>{hotel.location}</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Star size={18} className="me-1 text-warning" fill="#ffc107" />
              <span className="me-2">{hotel.rating}</span>
              <Badge bg="primary" className="ms-auto">
                {hotel.price}/night
              </Badge>
            </div>
          </Col>
          <Col md={6}>
            <h5>About</h5>
            <p>{hotel.description}</p>

            <h5 className="mt-3">Amenities</h5>
            <div className="amenities-container">
              {hotel.amenities.map((amenity, index) => (
                <Badge bg="light" text="dark" key={index} className="me-2 mb-2 p-2">
                  {amenity}
                </Badge>
              ))}
            </div>

            <h5 className="mt-3">Contact</h5>
            <div className="d-flex align-items-center mb-2">
              <Phone size={16} className="me-2 text-primary" />
              <span>{hotel.contact.phone}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Globe size={16} className="me-2 text-primary" />
              <a href={`https://${hotel.contact.website}`} target="_blank" rel="noopener noreferrer">
                {hotel.contact.website}
              </a>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary">
          <Calendar size={16} className="me-2" />
          Book Now
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function FavoriteListPage() {
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [listHotels, setListHotels] = useState([]);

  const getDataFavoriteHotel = async () => {

   try {
      
      const response = await axios.get(`${BASE_URL}`)

   } catch (error) {
      
   }

  }

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">My Favorite Hotels</h1>
      <p className="text-center text-muted mb-5">Click on a hotel to view more details</p>

      <Row>
        {hotels.map((hotel) => (
          <Col key={hotel.id} xs={12} sm={6} lg={4}>
            <HotelCard hotel={hotel} onClick={handleHotelClick} />
          </Col>
        ))}
      </Row>

      <HotelDetailModal show={showModal} hotel={selectedHotel} onHide={handleCloseModal} />
    </Container>
  )
}

export default FavoriteListPage

