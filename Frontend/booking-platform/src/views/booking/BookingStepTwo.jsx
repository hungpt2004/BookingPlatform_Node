"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Card, Button, Row, Col, Form, Badge } from "react-bootstrap"
import axiosInstance from "../../utils/AxiosInstance"
import { formatCurrencyVND } from "../../utils/FormatPricePrint"
import CustomNavbar from "../../components/navbar/CustomNavbar"
import { renderStarIcon } from "../../utils/RenderPersonIcon"
import { RatingConsider } from "../../utils/RatingConsider"
import {
  FaConciergeBell,
  FaCheckCircle,
  FaChevronRight,
  FaChevronDown,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBed,
  FaInfoCircle,
  FaPercent,
  FaLock,
} from "react-icons/fa"

const BookingStepTwo = () => {
  const { state: bookingData } = useLocation()
  const navigate = useNavigate()
  const [item, setItem] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [expandedRooms, setExpandedRooms] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "VN",
    phoneNumber: "",
    arrivalTime: "",
  })

  const {
    userId,
    hotelId,
    totalRooms,
    roomQuantities,
    checkInDate,
    checkOutDate,
    totalPrice,
    roomDetails,
    roomIds,
    currentHotel,
    distanceNight,
    listFeedback,
    numberOfPeople,
    checkInTime, 
    checkOutTime
  } = bookingData || {}

  useEffect(() => {
    if (!bookingData) return

    const fetchAndExpandRooms = async () => {
      try {
        // Fetch all rooms by their IDs
        const roomsData = await Promise.all(
          roomIds.map((room) => axiosInstance.get(`/room/get-room-by-id/${room.roomId}`).then((res) => res.data.room)),
        )

        // Expand rooms based on quantity
        const expanded = []
        roomsData.forEach((room) => {
          const quantity = roomQuantities[room._id]
          for (let i = 0; i < quantity; i++) {
            expanded.push({
              ...room,
              instanceId: `${room._id}-${i}`, // Unique ID per instance
            })
          }
        })

        setExpandedRooms(expanded)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      }
    }

    fetchAndExpandRooms()
  }, [roomIds, bookingData])

  console.log(`Expanded room : ${JSON.stringify(expandedRooms, 2)}`)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // If no booking data is provided, render a message and a back button.
  if (!bookingData) {
    return (
      <Container className="mt-5 text-center">
        <Card className="shadow-sm border-0 p-5">
          <Card.Body className="text-center">
            <FaInfoCircle className="text-danger mb-3" style={{ fontSize: "3rem" }} />
            <h3 className="mb-4">No booking data found</h3>
            <p className="text-muted mb-4">
              It seems you've reached this page without selecting a room. Please go back and make a selection.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate(-1)}
              className="px-4 py-2"
              style={{ backgroundColor: "#003B95", borderColor: "#003B95" }}
            >
              <FaChevronRight className="me-2" style={{ transform: "rotate(180deg)" }} />
              Go Back to Selection
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  // Calculate total rooms selected by summing up the quantities
  const totalRoomsSelected = Object.values(roomQuantities).reduce((sum, quantity) => sum + quantity, 0)

  // Only show rooms that have quantity > 0
  const selectedRooms = roomDetails.filter((room) => room.quantity > 0)

  const generateTimeOptions = () => {
    const options = []
    let hour = 0
    const minute = 0

    while (hour < 24) {
      const formattedHour = hour < 10 ? `0${hour}` : hour
      const formattedMinute = minute < 10 ? `0${minute}` : minute
      const timeLabel = `${formattedHour}:${formattedMinute}`

      options.push(
        <option key={timeLabel} value={timeLabel}>
          {timeLabel} - {formattedHour === "25" ? "02" : hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:{formattedMinute}
        </option>,
      )

      hour++
    }

    return options
  }

  const payment = async () => {
    try {
      const responseBooking = await axiosInstance.post("/payment/create-booking", {
        hotelId,
        roomIds,
        checkInDate,
        checkOutDate,
        roomDetails,
        totalPrice,
      })

      if (responseBooking.data && responseBooking.data.message && responseBooking.data.reservation) {
        const reservationId = responseBooking.data.reservation._id

        const responsePayment = await axiosInstance.post("/payment/create-payment-link", {
          amount: totalPrice,
          rooms: roomDetails,
          hotelId: hotelId,
          roomIds: roomIds,
          reservationId: reservationId,
        })

        sessionStorage.setItem("payment_link", responsePayment.data.checkoutUrl)

        window.location.href = responsePayment.data.checkoutUrl
      }
    } catch (error) {
      console.error("Payment error:", error)
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className="py-4" style={{ backgroundColor: "#f5f5f5" }}>
        <Container className="py-3" style={{ maxWidth: "85%" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Complete Your Booking</h4>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: "24px", height: "24px" }}
                >
                  1
                </div>
                <span className="text-muted">Room Selection</span>
              </div>
              <div className="d-flex align-items-center me-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: "24px", height: "24px" }}
                >
                  2
                </div>
                <span className="fw-bold">Your Details</span>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center me-2"
                  style={{ width: "24px", height: "24px", border: "1px solid #dee2e6" }}
                >
                  3
                </div>
                <span className="text-muted">Final Confirmation</span>
              </div>
            </div>
          </div>

          <Row>
            <Col md={8}>
              <Card className="rounded shadow-sm border-0 mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaPercent />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">Save 10% or more on this booking</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                        Sign in with Genius, Booking.com's loyalty programme to unlock special discounts
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="rounded shadow-sm border-0 mb-3">
                <Card.Header className="bg-white py-3 border-0">
                  <h5 className="mb-0 fw-bold">Enter your details</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaUser className="text-primary me-2" />
                          First name <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaUser className="text-primary me-2" />
                          Last name <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-1">
                        <Form.Label className="d-flex align-items-center">
                          <FaEnvelope className="text-primary me-2" />
                          Email address <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="py-2"
                        />
                      </Form.Group>
                      <p className="text-muted" style={{ fontSize: "13px" }}>
                        Confirmation email will be sent to this address
                      </p>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaGlobe className="text-primary me-2" />
                          Country/region <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="py-2"
                        >
                          <option value="VN">Vietnam</option>
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="JP">Japan</option>
                          <option value="SG">Singapore</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaPhone className="text-primary me-2" />
                          Phone number <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="text"
                            value="VN +84"
                            readOnly
                            className="py-2 me-2"
                            style={{ maxWidth: "100px" }}
                          />
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            className="py-2"
                            placeholder="e.g., 912345678"
                          />
                        </div>
                        <p className="text-muted mt-1" style={{ fontSize: "13px" }}>
                          We'll only contact you in case of booking changes
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="rounded shadow-sm border-0 mb-3">
                <Card.Header className="bg-white py-3 border-0">
                  <h5 className="mb-0 fw-bold">Room guest details</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {expandedRooms.map((room, index) => (
                    <div key={index} className="p-4 border-bottom">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaBed />
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold">
                            {room.type} - Room {index + 1}
                          </h6>
                          <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                            {room.capacity} guests maximum
                          </p>
                        </div>
                      </div>

                      <div className="ms-5 ps-2">
                        <p className="mb-2 fw-bold">Guest name</p>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Control type="text" placeholder="First name" className="py-2" />
                          </Col>
                          <Col md={6}>
                            <Form.Control type="text" placeholder="Last name" className="py-2" />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              <Card className="rounded shadow-sm border-0 mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px", flexShrink: 0 }}
                    >
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <h5 className="mb-3 fw-bold">Your arrival time</h5>

                      <div className="d-flex align-items-center mb-3">
                        <FaConciergeBell className="text-success fs-4 me-3" />
                        <span>Late check-in available until 23:00</span>
                      </div>

                      <div className="d-flex align-items-center mb-4">
                        <FaCheckCircle className="text-success fs-4 me-3" />
                        <span>24-hour reception - Help is always available whenever you need it!</span>
                      </div>

                      <Form.Group>
                        <Form.Label className="fw-bold">
                          Add your estimated time of arrival <span className="fw-normal text-muted">(optional)</span>
                        </Form.Label>
                        <Form.Select
                          name="arrivalTime"
                          value={formData.arrivalTime}
                          onChange={handleInputChange}
                          className="py-2"
                        >
                          <option value="">I don't know</option>
                          {generateTimeOptions()}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
                <Button variant="outline-primary" onClick={() => navigate(-1)} className="py-2 w-25">
                  <FaChevronRight className="me-2" style={{ transform: "rotate(180deg)" }} />
                  Back to Room Selection
                </Button>

                <Button
                  variant="primary"
                  onClick={payment}
                  className="py-2 w-25"
                  style={{ backgroundColor: "#003B95", borderColor: "#003B95" }}
                >
                  Continue to Final Details
                  <FaChevronRight className="ms-2" />
                </Button>
              </div>
            </Col>

            <Col md={4}>
              <Card className="rounded shadow-sm border-0 mb-3 sticky-top" style={{ top: "20px" }}>
                <Card.Header className="bg-white py-3 border-0">
                  <h5 className="mb-0 fw-bold">Your booking summary</h5>
                </Card.Header>

                <Card.Body className="p-0">
                  <div className="p-3 border-bottom">
                    <div className="d-flex align-items-start">
                      <div
                        className="bg-light rounded me-3"
                        style={{ width: "80px", height: "80px", overflow: "hidden" }}
                      >
                        <img
                          src={
                            currentHotel.images && currentHotel.images.length > 0
                              ? currentHotel.images[0]
                              : "/placeholder.svg"
                          }
                          alt={currentHotel.hotelName}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div>
                        <div className="d-flex align-items-center mb-1">
                          <span className="me-2">Hotel</span>
                          {renderStarIcon(currentHotel.rating)}
                        </div>
                        <h6 className="fw-bold mb-1">{currentHotel.hotelName}</h6>
                        <p
                          className="mb-1 text-muted"
                          style={{
                            fontSize: "13px",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {currentHotel.address}
                        </p>
                        <div className="d-flex align-items-center">
                          <Badge bg="primary" className="me-2 py-1 px-2">
                            {currentHotel.rating}
                          </Badge>
                          <span className="fw-bold" style={{ fontSize: "14px" }}>
                            {RatingConsider(currentHotel.rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-bottom">
                    <Row>
                      <Col xs={6} className="border-end">
                        <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                          Check-in
                        </p>
                        <p className="fw-bold mb-1">{checkInDate}</p>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          From {checkInTime}
                        </p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                          Check-out
                        </p>
                        <p className="fw-bold mb-1">{checkOutDate}</p>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Until {checkOutTime}
                        </p>
                      </Col>
                    </Row>
                    <div className="mt-2">
                      <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                        Total stay
                      </p>
                      <p className="fw-bold mb-0">
                        {distanceNight} {distanceNight > 1 ? "nights" : "night"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border-bottom">
                    <div
                      className="d-flex justify-content-between align-items-center fw-bold mb-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleToggle}
                    >
                      <span>
                        {totalRoomsSelected} room(s) for {numberOfPeople} {numberOfPeople > 1 ? "people" : "person"}
                      </span>
                      <span
                        style={{
                          display: "inline-block",
                          transition: "transform 0.45s ease-in-out",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <FaChevronDown />
                      </span>
                    </div>

                    <div
                      style={{
                        maxHeight: isOpen ? (totalRoomsSelected > 15 ? "600px" : "300px") : "0px",
                        overflowY: "hidden",
                        transition: "max-height 0.45s ease-in-out",
                      }}
                    >
                      {selectedRooms.length === 0 ? (
                        <p className="text-muted">No rooms selected.</p>
                      ) : (
                        selectedRooms.map((room, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              {room.quantity} x {room.roomType}
                            </span>
                            <span className="text-muted">
                              {formatCurrencyVND(totalPrice)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => navigate(-1)}
                      style={{ fontSize: "14px" }}
                    >
                      Change my selection
                    </Button>
                  </div>

                  <div className="p-3 border-bottom">
                    <h6 className="fw-bold mb-3">Price summary</h6>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Original price</span>
                      <span className="text-decoration-line-through">{formatCurrencyVND(totalPrice * 1.2)}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                      <div>
                        <p className="mb-0">Early 2025 Offer</p>
                        <p className="text-muted" style={{ fontSize: "12px" }}>
                          Special promotion for stays from Jan-Apr 2025
                        </p>
                      </div>
                      <span className="text-success">-{formatCurrencyVND(totalPrice * 0.1)}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                      <div>
                        <p className="mb-0">Genius Discount</p>
                        <p className="text-muted" style={{ fontSize: "12px" }}>
                          Loyalty member discount
                        </p>
                      </div>
                      <span className="text-success">-{formatCurrencyVND(totalPrice * 0.1)}</span>
                    </div>
                  </div>

                  <div className="p-3" style={{ backgroundColor: "#EBF3FF" }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h5 className="fw-bold mb-0">Total price</h5>
                      <h5 className="fw-bold mb-0">{formatCurrencyVND(totalPrice)}</h5>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Including taxes and fees
                    </p>

                    <div className="mt-3 p-2 bg-white rounded d-flex align-items-center">
                      <FaLock className="text-success me-2" />
                      <span style={{ fontSize: "13px" }}>
                        We use secure transmission and encrypted storage to protect your personal information
                      </span>
                    </div>
                    
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default BookingStepTwo

