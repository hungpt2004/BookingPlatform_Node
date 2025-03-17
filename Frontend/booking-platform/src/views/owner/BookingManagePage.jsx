import { useState, useEffect } from "react"
import { Navbar, Nav, Container, Row, Col, Form, Button, Dropdown, Card } from "react-bootstrap"
import { Printer, Download, Filter, FileIcon as FileEarmark, Hotel, Building, User } from "lucide-react"
import { BASE_URL } from '../../utils/Constant';
import AdminSidebar from '../../components/navbar/AdminSidebar';
import axios from "axios"
import Sidebar from "../../components/navbar/AdminSidebar";
import axiosInstance from "../../utils/AxiosInstance";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";

export default function BookingManagePage() {
    const [dateRange, setDateRange] = useState("")
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                console.log("Stored token:", localStorage.getItem("token"))

                if (!token) {
                    setError("Not authenticated. Please login.")
                    setLoading(false)
                    return
                }
                const userResponse = await axiosInstance.get(`/customer/current-user`);
                if (userResponse.data.error === false) {
                    setCurrentUser(userResponse.data.user)

                    const hotelResponse = await axiosInstance.get(
                        `/hotel/get-owned-hotel`,
                    );

                    if (hotelResponse.data.error === false) {
                        setHotels(hotelResponse.data.hotels)
                    } else {
                        setError(hotelResponse.data.message)
                    }
                } else {
                    setError(userResponse.data.message)
                }
            } catch (err) {
                console.error("Error fetching data:", err)
                setError(err.response?.data?.message || "Failed to fetch data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <><div className="d-flex">
            <AdminSidebar />
            <div className="booking-app flex-grow-1" style={{ paddingLeft: "20px" }}>

                <Container className="py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <label className="text-dark fw-bold fs-3">Khách sạn của tôi</label>

                        {currentUser && (
                            <div className="d-flex align-items-center">
                                <div className="me-3 text-end">
                                    <p className="mb-0 fw-bold">{currentUser.name || currentUser.email}</p>
                                    <small className="text-muted">{currentUser.role}</small>
                                </div>
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: "40px", height: "40px" }}>
                                    {currentUser.image?.url ? (
                                        <img
                                            src={currentUser.image.url}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-4 d-flex align-items-center">
                        <div className="me-3">
                            <div className="me-3">
                                <Form.Group>
                                    <Form.Label>Sắp xếp theo</Form.Label>
                                    <Form.Group>
                                        <Form.Select variant="light" className="text-start border">
                                            <option>Mới nhất</option>
                                            <option>Đánh giá cao nhất</option>
                                            <option>Giá thấp đến cao</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form.Group>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <div className="mb-3">
                                    <FileEarmark size={48} className="text-danger" />
                                </div>
                                <Card.Text className="text-secondary">
                                    {error}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ) : hotels.length === 0 ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <div className="mb-3">
                                    <FileEarmark size={48} className="text-secondary" />
                                </div>
                                <Card.Text className="text-secondary">
                                    Bạn chưa có khách sạn nào. Hãy tạo khách sạn đầu tiên của mình.
                                </Card.Text>
                                <Button variant="primary" href="/hotels/create">
                                    Tạo khách sạn
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Row>
                            {hotels.map((hotel) => (
                                <Col md={4} className="mb-4" key={hotel._id}>
                                    <Card>
                                        {hotel.images && hotel.images.length > 0 ? (
                                            <Card.Img
                                                variant="top"
                                                src={hotel.images[0]}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light text-center py-5"
                                                style={{ height: "200px" }}
                                            >
                                                <Building size={48} className="text-secondary mt-4" />
                                                <p>Không có hình ảnh</p>
                                            </div>
                                        )}
                                        <Card.Body>
                                            <Card.Title>{hotel.hotelName}</Card.Title>
                                            <Card.Text className="text-muted small mb-2">
                                                {hotel.address}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <span className="me-2">{hotel.star} ★</span>
                                                    <span className="text-warning">{hotel.rating.toFixed(1)}</span>
                                                </div>
                                                <div>
                                                    <span className="fw-bold">₫{hotel.pricePerNight.toLocaleString()}</span>
                                                    <span className="text-muted">/đêm</span>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    className="w-100"
                                                    href={`/booking-schedule/${hotel._id || ''}`}
                                                    onClick={(e) => {
                                                        if (!hotel._id) {
                                                            e.preventDefault();
                                                            alert("Cannot manage this hotel: Missing hotel ID");
                                                        }
                                                    }}
                                                >
                                                    Quản lý
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </div>
            </div>
        </>
            )
}