import { Card, Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mapContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
};

const contentWrapperStyle = {
    position: 'relative',
    minHeight: '750px',
    marginBottom: '30px',
};

const floatingCardStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 10,
    width: '400px',
    maxWidth: 'calc(100% - 20px)',
    maxHeight: 'calc(100% - 100px)',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
};

const bottomButtonsStyle = {
    position: 'absolute',
    bottom: '20px',
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px'
};

const defaultCenter = {
    lat: 10.8231, // Default to Vietnam coordinates
    lng: 106.6297
};
const stepContainer = {
    width: "100%",          // Dấu % phải để trong chuỗi
    maxWidth: "3500px",    // Không có khoảng trắng giữa maxWidth
    margin: "auto"         // Phải đặt trong chuỗi
};

// Component to handle map events
function MapEvents({ onMapClick, updateMapPin }) {
    useMapEvents({
        click: (e) => {
            if (!updateMapPin) {
                onMapClick(e);
            }
        },
    });
    return null;
}

// Component to handle marker drag events
function DraggableMarker({ position, setPosition, geocode }) {
    const markerRef = useRef(null);

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const newPos = marker.getLatLng();
                setPosition(newPos);
                geocode(newPos);
            }
        },
    };

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
}

const Step5 = ({ nextStep, prevStep }) => {
    // Get saved location data from sessionStorage if available
    const [locationData, setLocationData] = useState(() => {
        const savedLocation = sessionStorage.getItem("hotelLocation");
        return savedLocation ? JSON.parse(savedLocation) : {
            address: '',
            apartment: '',
            country: 'vn',
            city: '',
            postalCode: '',
            updateMapPin: true,
            position: defaultCenter
        };
    });

    const [showInfoAlert, setShowInfoAlert] = useState(true);
    const mapRef = useRef(null);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // For checkbox use the checked value, otherwise use the input value
        const inputValue = type === 'checkbox' ? checked : value;

        // Update state with new values
        setLocationData({
            ...locationData,
            [name]: inputValue
        });
    };

    // Save location data to sessionStorage when it changes
    useEffect(() => {
        sessionStorage.setItem("hotelLocation", JSON.stringify(locationData));
    }, [locationData]);

    // Geocode coordinates to address using Nominatim (OpenStreetMap's geocoding service)
    const reverseGeocode = async (latlng) => {
        if (!locationData.updateMapPin) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'vi' } }
            );
            const data = await response.json();

            if (data && data.address) {
                const { road, house_number, city, town, village, postcode, country_code } = data.address;

                // Build address string
                let addressStr = '';
                if (house_number) addressStr += house_number + ' ';
                if (road) addressStr += road;

                // Determine city (could be in city, town, or village field)
                const cityName = city || town || village || '';

                setLocationData(prev => ({
                    ...prev,
                    address: addressStr || prev.address,
                    city: cityName || prev.city,
                    postalCode: postcode || prev.postalCode,
                    country: country_code || prev.country
                }));
            }
        } catch (error) {
            console.error("Error in reverse geocoding:", error);
        }
    };

    // Geocode address to coordinates using Nominatim
    const geocodeAddress = async () => {
        if (!locationData.address) return;

        try {
            const query = encodeURIComponent(locationData.address);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&addressdetails=1`,
                { headers: { 'Accept-Language': 'vi' } }
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const position = {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                };

                // Extract address details
                if (data[0].address) {
                    const { city, town, village, postcode, country_code } = data[0].address;
                    const cityName = city || town || village || '';

                    setLocationData(prev => ({
                        ...prev,
                        position,
                        city: cityName || prev.city,
                        postalCode: postcode || prev.postalCode,
                        country: country_code || prev.country
                    }));
                } else {
                    setLocationData(prev => ({
                        ...prev,
                        position
                    }));
                }

                // Center map on the new position
                if (mapRef.current) {
                    mapRef.current.setView(position, 15);
                }
            }
        } catch (error) {
            console.error("Error in geocoding:", error);
        }
    };

    // Handle map click - update position and optionally address
    const handleMapClick = (e) => {
        const newPosition = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        };

        setLocationData(prev => ({
            ...prev,
            position: newPosition
        }));

        reverseGeocode(newPosition);
    };

    // Check if form is valid
    const isFormValid = locationData.address && locationData.country && locationData.city;

    // Handle continuing to next step
    const handleContinue = () => {
        // Save current data to sessionStorage
        sessionStorage.setItem("hotelLocation", JSON.stringify(locationData));
        nextStep();
    };

    // Handle address search
    const handleAddressSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            geocodeAddress();
        }
    };

    return (
        <div className='pt-1'style={stepContainer}>
            {/* Fullscreen map with floating card */}
            <div style={contentWrapperStyle}>
                {/* OpenStreetMap Component - Full screen */}
                <div style={mapContainerStyle}>
                    <MapContainer
                        center={[locationData.position.lat, locationData.position.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={mapInstance => {
                            mapRef.current = mapInstance;
                        }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker
                            position={[locationData.position.lat, locationData.position.lng]}
                            setPosition={(pos) => {
                                setLocationData(prev => ({
                                    ...prev,
                                    position: { lat: pos.lat, lng: pos.lng }
                                }));
                            }}
                            geocode={reverseGeocode}
                        />
                        <MapEvents
                            onMapClick={handleMapClick}
                            updateMapPin={locationData.updateMapPin}
                        />
                    </MapContainer>
                </div>

                {/* Floating Form Card */}
                <Card style={floatingCardStyle} className="p-3 shadow">

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Tìm địa chỉ của Quý vị</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên phố, số nhà..."
                                    name="address"
                                    value={locationData.address}
                                    onChange={handleInputChange}
                                    onKeyDown={handleAddressSearch}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={geocodeAddress}
                                >
                                    Tìm kiếm
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số căn hộ hoặc tầng (không bắt buộc)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Căn hộ, tòa nhà, tầng, v.v."
                                name="apartment"
                                value={locationData.apartment}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Vùng/quốc gia</Form.Label>
                            <Form.Select
                                name="country"
                                value={locationData.country}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Chọn quốc gia</option>
                                <option value="vn">Việt Nam</option>
                                <option value="gb">Vương Quốc Anh</option>
                                <option value="us">Hoa Kỳ</option>
                                <option value="jp">Nhật Bản</option>
                                <option value="kr">Hàn Quốc</option>
                                <option value="sg">Singapore</option>
                                <option value="th">Thái Lan</option>
                            </Form.Select>
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Thành phố</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên thành phố"
                                        name="city"
                                        value={locationData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Mã bưu chính</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã bưu chính"
                                        name="postalCode"
                                        value={locationData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Check
                                type="checkbox"
                                label="Cập nhật địa chỉ khi đi chuyển ghim trên bản đồ."
                                name="updateMapPin"
                                checked={locationData.updateMapPin}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {showInfoAlert && (
                            <Alert variant="info" className="d-flex align-items-start">
                                <FaInfoCircle className="me-2 mt-1" />
                                <div>
                                    Vị trí ghim đó có sai không? Nếu vị trí ghim đó không chính xác, Quý vị có thể bỏ chọn lựa chọn ở trên và nhấn hoặc chạm vào bản đồ để di chuyển ghim đến đúng vị trí.
                                </div>
                                <button
                                    type="button"
                                    className="btn-close ms-2"
                                    aria-label="Close"
                                    onClick={() => setShowInfoAlert(false)}
                                />
                            </Alert>
                        )}
                    </Form>
                </Card>

                {/* Bottom Navigation Buttons */}
                <div style={bottomButtonsStyle}>
                    <Button variant="secondary" onClick={prevStep} className="shadow">
                        Quay lại
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className="shadow"
                    >
                        Tiếp tục
                    </Button>
                </div>
            </div>
        </div>
    );
};

Step5.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};
MapEvents.propTypes = {
    onMapClick: PropTypes.func,
    updateMapPin: PropTypes.bool
};
DraggableMarker.propTypes = {
    position: PropTypes.object,
    setPosition: PropTypes.func,
    geocode: PropTypes.func
};
export default Step5;