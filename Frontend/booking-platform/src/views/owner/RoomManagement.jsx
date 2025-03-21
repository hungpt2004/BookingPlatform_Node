import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Select, Row, Col, Input, Checkbox, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/AxiosInstance";
import Sidebar from "../../components/navbar/AdminSidebar";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import { useLocation, useNavigate, } from "react-router-dom";

const RoomManagePage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialHotelId = queryParams.get("hotelId");
    const [formData, setFormData] = useState({
        type: "",
        capacity: 1,
        price: 0,
        quantity: 1,
        description: "",
        bedTypes: [],
        amenities: []
    });

    const [bedOptions, setBedOptions] = useState([]);
    const [facilityOptions, setFacilityOptions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const initializeBedTypes = () => {
            if (bedOptions.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    bedTypes: bedOptions.map(bed => ({
                        _id: bed._id,
                        name: bed.name,
                        count: 0,
                    }))
                }));
            }
        };
        initializeBedTypes();
    }, [bedOptions]);

    // Fetch initial data
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const bedsResponse = await axiosInstance.get('/bed/get-all-bed');
                const facilitiesResponse = await axiosInstance.get('/roomFacility/get-hotelfacilities');

                setBedOptions(bedsResponse.data.beds);
                setFacilityOptions(facilitiesResponse.data.facilities);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
        fetchOptions();
    }, []);


    const handleBedCountChange = (index, delta) => {
        setFormData(prev => {
            const updatedBedTypes = prev.bedTypes.map((bed, i) => {
                if (i === index) {
                    const newCount = Math.max(bed.count + delta, 0);
                    return { ...bed, count: newCount };
                }
                return bed;
            });


            return {
                ...prev,
                bedTypes: updatedBedTypes,
            };
        });
    };


    const handleSubmitRoom = async () => {
        try {
            // Prepare the bed array in required format
            console.log("formDataAtSubmit::", formData);
            const formattedBeds = formData.bedTypes
                .map(bed => ({
                    bed: bed._id,
                    quantity: bed.count
                }));

            const payload = {
                type: formData.type,
                capacity: formData.capacity,
                price: formData.price,
                quantity: formData.quantity,
                description: formData.description,
                bed: formattedBeds,
                facilities: formData.facilities
            };

            console.log("payload::", payload);

            const url = selectedRoom
                ? `/room/update/${selectedRoom._id}`
                : `/room/create-room/${selectedHotel._id}`;

            const method = selectedRoom ? "put" : "post";

            const response = await axiosInstance[method](url, payload);

            if (response.data) {
                setRooms(prev => selectedRoom
                    ? prev.map(r => r._id === selectedRoom._id ? response.data.room : r)
                    : [...prev, response.data.room]
                );
                setShowRoomModal(false);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Operation failed");
        }
    };



    // Set selected hotel from query params once hotels are loaded
    useEffect(() => {
        if (initialHotelId && hotels.length > 0) {
            const hotel = hotels.find((h) => h._id === initialHotelId);
            if (hotel) {
                setSelectedHotel(hotel);
            }
        }
    }, [initialHotelId, hotels]);

    const toCreateRoom = (hotelId) => {
        navigate(`/create-room/${hotelId}`);
    };

    // Fetch hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axiosInstance.get("/hotel/get-owned-hotel");
                if (response.data?.hotels) {
                    setHotels(response.data.hotels);
                }
            } catch (error) {
                setError("Failed to load hotels");
            }
        };
        fetchHotels();
    }, []);

    // Fetch rooms for the selected hotel
    useEffect(() => {
        const fetchRooms = async () => {
            if (!selectedHotel) return;
            try {
                const response = await axiosInstance.get(`/room/get-room-owner/${selectedHotel._id}`);
                if (response.data?.rooms) {
                    setRooms(response.data.rooms);
                    console.log("rooms::", response.data.rooms);
                }
            } catch (error) {
                setError("Failed to load rooms");
            }
        };
        fetchRooms();
    }, [selectedHotel]);

    const handleHotelSelect = (hotelId) => {
        const hotel = hotels.find((h) => h._id === hotelId);
        setSelectedHotel(hotel);
    };

    const handleDeleteRoom = async () => {
        try {
            await axiosInstance.delete(`/room/delete/${selectedRoom._id}`);
            setRooms((prev) => prev.filter((r) => r._id !== selectedRoom._id));
            setShowDeleteModal(false);
        } catch (error) {
            setError("Delete failed");
        }
    };

    // Define columns for antd Table
    const columns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity"
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, room) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            // Transform bed data to match bedTypes structure
                            const transformedBedTypes = bedOptions.map(bedOption => ({
                                _id: bedOption._id,
                                name: bedOption.name,
                                // Check if bed.bed is a string ID or a populated object
                                count: room.bed?.find(b =>
                                    (b.bed._id || b.bed) === bedOption._id // Handle both cases
                                )?.quantity || 0 // Default to 0 if not found
                            }));

                            setFormData({
                                ...room,
                                bedTypes: transformedBedTypes,
                            });
                            setSelectedRoom(room);
                            setShowRoomModal(true);
                        }}
                    >
                        {console.log("transformedBedTypes::", bedOptions.map(bed => ({
                            _id: bed._id,
                            name: bed.name,
                            count: room.bed?.find(b => b.bed === bed._id)?.quantity,
                        })))}
                        {console.log("formData.bedTypes::", formData.bedTypes)}
                        {console.log("room::", room)}
                        <EditOutlined />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            setSelectedRoom(room);
                            setShowDeleteModal(true);
                        }}
                    >
                        <DeleteOutlined />
                    </Button>
                </>
            )
        }
    ];

    const renderBedConfiguration = () => (
        <Form.Item label="Bed Configuration">
            {console.log("bedOptions::", bedOptions)}
            {console.log("formData.bedTypes::", formData.bedTypes)}
            {bedOptions.map((bedOption, index) => {
                const bedType = formData.bedTypes.find(bt => bt._id === bedOption._id);
                const count = bedType?.count || 0;

                return (
                    <Row key={bedOption._id} gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="material-symbols-outlined" style={{ marginRight: 8 }}>
                                    {bedOption.name.includes("đơn") ? "single_bed" : "king_bed"}
                                </span>
                                <div className="d-flex flex-column">
                                    <div className="mb-0">{bedOption.name}</div>
                                    <div className="text-secondary" style={{ fontSize: "0.8rem" }}>
                                        {bedOption.description}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Input.Group compact>
                                <Button
                                    onClick={() => handleBedCountChange(index, -1)}
                                    disabled={count === 0}
                                >
                                    -
                                </Button>
                                <Input
                                    style={{ width: 60, textAlign: 'center' }}
                                    value={count}
                                    readOnly
                                />
                                <Button
                                    onClick={() => handleBedCountChange(index, +1)}
                                >
                                    +
                                </Button>
                            </Input.Group>
                        </Col>
                    </Row>
                );
            })}
        </Form.Item>
    );

    // facilities rendering
    const renderFacilities = () => (
        <Form.Item label="Facilities">
            <Checkbox.Group
                value={formData.facilities}
                onChange={values => setFormData({ ...formData, facilities: values })}
            >
                <Row>
                    {facilityOptions.map(facility => (
                        <Col span={8} key={facility._id}>
                            <Checkbox value={facility._id}>
                                {facility.name}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </Form.Item>
    );


    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <AdminCustomNavbar />
                <div style={{ padding: "24px" }}>
                    <h2 style={{ marginBottom: "24px" }}>Room Management</h2>
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: "16px" }}
                        />
                    )}
                    <Form layout="vertical" style={{ marginBottom: "16px" }}>
                        <Form.Item label="Select Hotel">
                            <Select
                                placeholder="Choose a hotel"
                                onChange={handleHotelSelect}
                                value={selectedHotel?._id || undefined}
                            >
                                {hotels.map((hotel) => (
                                    <Select.Option key={hotel._id} value={hotel._id}>
                                        {hotel.hotelName} ({hotel.address})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                    {selectedHotel && (
                        <>
                            <Row justify="space-between" style={{ marginBottom: "16px" }}>
                                <h4>{selectedHotel.hotelName} Rooms</h4>
                                <Button type="primary" onClick={() => toCreateRoom(selectedHotel._id)}>
                                    <PlusOutlined /> Add Room
                                </Button>
                            </Row>
                            <Table dataSource={rooms} columns={columns} rowKey="_id" />
                        </>
                    )}

                    <Modal
                        title={selectedRoom && "Edit Room"}
                        open={showRoomModal}
                        onCancel={() => setShowRoomModal(false)}
                        onOk={handleSubmitRoom}
                        okText={selectedRoom && "Save Changes"}
                    >
                        <Form layout="vertical">
                            <Form.Item label="Room Type">
                                <Select
                                    value={formData.type}
                                    onChange={value => setFormData({ ...formData, type: value })}
                                >
                                    <Select.Option value="Phòng giường đôi">Phòng giường đôi</Select.Option>
                                    <Select.Option value="Phòng giường đơn">Phòng giường đơn</Select.Option>
                                    <Select.Option value="Phòng giường 4 người">Phòng giường 4 người</Select.Option>
                                    <Select.Option value="Phòng 2 giường đơn">Phòng 2 giường đơn</Select.Option>
                                </Select>
                            </Form.Item>

                            {renderBedConfiguration()}
                            {renderFacilities()}

                            <div className="d-flex gap-2">
                                <Form.Item label="Capacity" className="w-50">
                                    <InputNumber
                                        min={1}
                                        value={formData.capacity}
                                        onChange={value => setFormData({ ...formData, capacity: value })}
                                        required
                                        className="w-100"
                                    />
                                </Form.Item>

                                <Form.Item label="Room Quantity" className="w-50">
                                    <InputNumber
                                        min={1}
                                        value={formData.quantity}
                                        onChange={value => setFormData({ ...formData, quantity: value })}
                                        required
                                        className="w-100"
                                    />
                                </Form.Item>

                            </div>
                            <Form.Item label="Price">
                                <InputNumber
                                    min={1}
                                    value={formData.price}
                                    onChange={value => setFormData({ ...formData, price: value })}
                                    required
                                    className="w-100"
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    {/* Delete Confirmation Modal */}
                    <Modal
                        title="Confirm Delete"
                        open={showDeleteModal}
                        onCancel={() => setShowDeleteModal(false)}
                        onOk={handleDeleteRoom}
                        okType="danger"
                        okText="Delete Room"
                    >
                        <p>
                            Are you sure you want to delete this room? This action cannot be undone.
                        </p>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default RoomManagePage;
