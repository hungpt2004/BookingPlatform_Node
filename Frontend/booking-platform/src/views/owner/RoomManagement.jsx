import { useState, useEffect } from "react"
import { Navbar, Nav, Container, Row, Col, Form, Button, Dropdown, Card, Pagination, Badge } from "react-bootstrap"
import { Printer, Download, Filter, FileIcon as FileEarmark, Hotel, Building, User, ChevronLeft, ChevronRight, Bed } from "lucide-react"
import { BASE_URL } from '../../utils/Constant';
import AdminSidebar from '../../components/navbar/OwnerSidebar';
import axios from "axios"

export default function RoomManagePage() {
    const [dateRange, setDateRange] = useState("")
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [hotelRooms, setHotelRooms] = useState({}) // Store total room counts for each hotel
    const [availableRooms, setAvailableRooms] = useState({}) // Store available room counts
    const [roomDetails, setRoomDetails] = useState({}) // Store details of room info per hotel
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const [viewMode, setViewMode] = useState("grid") // grid or list
    const [sortBy, setSortBy] = useState("newest")

    // Get current date in YYYY-MM-DD format for default date values
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    
    // Date states for availability checking
    const [checkInDate, setCheckInDate] = useState(today)
    const [checkOutDate, setCheckOutDate] = useState(tomorrow)

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
                const userResponse = await axios.get(`${BASE_URL}/customer/current-user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (userResponse.data.error === false) {
                    setCurrentUser(userResponse.data.user)

                    const hotelResponse = await axios.get(
                        `${BASE_URL}/hotel/get-owned-hotel`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (hotelResponse.data.error === false) {
                        setHotels(hotelResponse.data.hotels)
                        
                        // Fetch room counts and availability for each hotel
                        const roomCountsObj = {};
                        const availableRoomsObj = {};
                        const roomDetailsObj = {};
                        
                        for (const hotel of hotelResponse.data.hotels) {
                            try {
                                // Get all rooms for this hotel
                                const roomsResponse = await axios.get(
                                    `${BASE_URL}/room/get-room-by-hotel/${hotel._id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                
                                if (roomsResponse.data.error === false) {
                                    const rooms = roomsResponse.data.rooms;
                                    
                                    // Calculate total rooms and available rooms
                                    let totalRooms = 0;
                                    let availableRoomsCount = 0;
                                    
                                    // Store room details for display
                                    const hotelRoomDetails = [];
                                    
                                    // Process each room
                                    for (const room of rooms) {
                                        totalRooms += room.quantity;
                                        
                                        // The 'quantity' field in the response represents available rooms
                                        // after subtracting booked quantity
                                        availableRoomsCount += room.quantity;
                                        
                                        hotelRoomDetails.push({
                                            id: room._id,
                                            type: room.type,
                                            total: room.quantity, // This is the total capacity
                                            available: room.quantity // This is available rooms
                                        });
                                    }
                                    
                                    roomCountsObj[hotel._id] = totalRooms;
                                    availableRoomsObj[hotel._id] = availableRoomsCount;
                                    roomDetailsObj[hotel._id] = hotelRoomDetails;
                                }
                            } catch (roomErr) {
                                console.error(`Error fetching rooms for hotel ${hotel._id}:`, roomErr);
                                roomCountsObj[hotel._id] = 0;
                                availableRoomsObj[hotel._id] = 0;
                                roomDetailsObj[hotel._id] = [];
                            }
                        }
                        
                        setHotelRooms(roomCountsObj);
                        setAvailableRooms(availableRoomsObj);
                        setRoomDetails(roomDetailsObj);
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
    }, [checkInDate, checkOutDate])

    // Update availability when dates change
    const handleDateChange = () => {
        // Re-fetch data with new dates
        setLoading(true);
        // The useEffect will run with the new dates
    }

    // Logic for sorting hotels
    const sortedHotels = [...hotels].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        } else if (sortBy === "rating") {
            return (b.rating || 0) - (a.rating || 0)
        } else if (sortBy === "price-asc") {
            return (a.basePrice || 0) - (b.basePrice || 0)
        } else if (sortBy === "rooms-desc") {
            return (hotelRooms[b._id] || 0) - (hotelRooms[a._id] || 0)
        } else if (sortBy === "availability") {
            return (availableRooms[b._id] || 0) - (availableRooms[a._id] || 0)
        }
        return 0;
    })

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentHotels = sortedHotels.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(hotels.length / itemsPerPage)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // Hotel card component
    const HotelCard = ({ hotel, viewMode }) => {
        const totalRooms = hotelRooms[hotel._id] || 0;
        const availableRoomCount = availableRooms[hotel._id] || 0;
        
        // Calculate availability percentage
        const availabilityPercentage = totalRooms > 0 
            ? Math.round((availableRoomCount / totalRooms) * 100) 
            : 0;
        
        // Determine badge color based on availability
        let badgeColor = "success";
        if (availabilityPercentage < 30) {
            badgeColor = "danger";
        } else if (availabilityPercentage < 70) {
            badgeColor = "warning";
        }
        
        return viewMode === "grid" ? (
            <Col lg={4} md={6} className="mb-4" key={hotel._id}>
                <Card className="h-100 shadow-sm hover-shadow transition-all">
                    <div className="position-relative">
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
                        <Badge bg={badgeColor} className="position-absolute top-0 end-0 m-2 d-flex align-items-center">
                            <Bed size={14} className="me-1" /> {availableRoomCount} / {totalRooms} phòng trống
                        </Badge>
                    </div>
                    <Card.Body>
                        <Card.Title>{hotel.hotelName}</Card.Title>
                        <Card.Text className="text-muted small mb-2">
                            {hotel.address}
                        </Card.Text>
                        <div className="d-flex gap-2 mt-3">
                            <Button
                                variant="outline-success"
                                className="w-100"
                                href={`/detail/${hotel._id}`}
                            >
                                Quản lý phòng
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ) : (
            <Col xs={12} className="mb-3" key={hotel._id}>
                <Card className="shadow-sm hover-shadow transition-all">
                    <Row className="g-0">
                        <Col md={4} className="position-relative">
                            {hotel.images && hotel.images.length > 0 ? (
                                <Card.Img
                                    src={hotel.images[0]}
                                    style={{ height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="bg-light text-center py-5 h-100"
                                >
                                    <Building size={48} className="text-secondary mt-4" />
                                    <p>Không có hình ảnh</p>
                                </div>
                            )}
                            <Badge bg={badgeColor} className="position-absolute top-0 end-0 m-2 d-flex align-items-center">
                                <Bed size={14} className="me-1" /> {availableRoomCount} / {totalRooms} phòng trống
                            </Badge>
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                    <Card.Title>{hotel.hotelName}</Card.Title>
                                </div>
                                <Card.Text className="text-muted mb-2">
                                    {hotel.address}
                                </Card.Text>
                                <Card.Text className="mb-3 small">
                                    {hotel.description ? hotel.description.substring(0, 150) + '...' : 'Không có mô tả'}
                                </Card.Text>
                                
                                {/* Room Details Section */}
                                {roomDetails[hotel._id] && roomDetails[hotel._id].length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="mb-2">Chi tiết phòng:</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {roomDetails[hotel._id].map(room => (
                                                <Badge key={room.id} bg="light" text="dark" className="px-2 py-1 border">
                                                    {room.type}: {room.available}/{room.total} phòng trống
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        href={`/detail/${hotel._id}`}
                                    >
                                        Xem chi tiết
                                    </Button>
                                    <Button
                                        variant="outline-success"
                                        href={`/rooms/manage/${hotel._id}`}
                                    >
                                        Quản lý phòng
                                    </Button>
                                </div>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Col>
        );
    };

    return (
        <><div className="d-flex">
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

                    {/* Date filter section */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col md={6} lg={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày nhận phòng</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} lg={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày trả phòng</Form.Label>
                                        <Form.Control 
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={4} className="d-flex align-items-end">
                                    <Button
                                        variant="primary"
                                        className="mb-3 w-100"
                                        onClick={handleDateChange}
                                    >
                                        Kiểm tra phòng trống
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between">
                        <div className="d-flex align-items-center mb-2 mb-md-0">
                            <Form.Group className="me-3">
                                <Form.Label>Sắp xếp theo</Form.Label>
                                <Form.Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-start border"
                                ><option value="newest">Mới nhất</option>
                                    <option value="rating">Đánh giá cao nhất</option>
                                    <option value="price-asc">Giá thấp đến cao</option>
                                    <option value="rooms-desc">Số phòng nhiều nhất</option>
                                    <option value="availability">Phòng trống nhiều nhất</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="me-3">
                                <Form.Label>Hiển thị</Form.Label>
                                <Form.Select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Reset to first page when changing items per page
                                    }}
                                    className="text-start border"
                                >
                                    <option value={3}>3 khách sạn</option>
                                    <option value={6}>6 khách sạn</option>
                                    <option value={9}>9 khách sạn</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="btn-group">
                            <Button
                                variant={viewMode === "grid" ? "primary" : "outline-primary"}
                                onClick={() => setViewMode("grid")}
                                className="px-3"
                            >
                                <i className="bi bi-grid"></i> Grid
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "primary" : "outline-primary"}
                                onClick={() => setViewMode("list")}
                                className="px-3"
                            >
                                <i className="bi bi-list"></i> List
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Đang kiểm tra phòng trống...</p>
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
                        <>
                            <div className="alert alert-info mb-4">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <span>Hiển thị tình trạng phòng trống từ <strong>{new Date(checkInDate).toLocaleDateString('vi-VN')}</strong> đến <strong>{new Date(checkOutDate).toLocaleDateString('vi-VN')}</strong></span>
                                </div>
                            </div>

                            <Row>
                                {currentHotels.map((hotel) => (
                                    <HotelCard key={hotel._id} hotel={hotel} viewMode={viewMode} />
                                ))}
                            </Row>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft size={16} />
                                        </Pagination.Prev>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={i + 1 === currentPage}
                                                onClick={() => paginate(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}

                                        <Pagination.Next
                                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight size={16} />
                                        </Pagination.Next>
                                    </Pagination>
                                </div>
                            )}

                            <div className="text-center mt-3 text-muted small">
                                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, hotels.length)} trên tổng số {hotels.length} khách sạn
                            </div>
                        </>
                    )}
                </Container>
            </div>
        </div>
        </>
    )
}