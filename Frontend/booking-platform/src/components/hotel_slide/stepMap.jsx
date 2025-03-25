import { Card, Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CustomFailedToast, CustomToast } from '../toast/CustomToast';

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
    lat: 10.8231, // Default to Ho Chi Minh City
    lng: 106.6297
};

const stepContainer = {
    width: "100%",
    maxWidth: "3500px",
    margin: "auto",
    marginTop: '100px',
    height: 'auto'
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

// Component to update map center when position changes
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, 15, { duration: 1 });
    }, [map, position]);
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setLocationData({
            ...locationData,
            [name]: inputValue
        });
    };

    // useEffect(() => {
    //     sessionStorage.setItem("hotelLocation", JSON.stringify(locationData));
    // }, [locationData]);

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
                let addressStr = '';
                if (house_number) addressStr += house_number + ' ';
                if (road) addressStr += road;
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

    const [isGeocoding, setIsGeocoding] = useState(false);

    const geocodeAddress = async () => {
        if (!locationData.address || locationData.address.length < 3) {
            CustomFailedToast.warning("Vui lòng nhập địa chỉ chi tiết hơn");
            return;
        }

        setIsGeocoding(true);

        try {
            const query = encodeURIComponent(locationData.address);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'vi',
                        'Referer': 'your-website.com'
                    }
                }
            );

            if (!response.ok) throw new Error("Geocoding failed");

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error("Address not found");
            }

            const { lat, lon } = data[0];
            const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };

            // Update state with new position
            setLocationData(prev => ({
                ...prev,
                position: newPosition,
                ...(data[0].address && {
                    city: data[0].address.city || prev.city,
                    postalCode: data[0].address.postcode || prev.postalCode,
                    country: data[0].address.country_code || prev.country
                })
            }));

        } catch (error) {
            console.error("Geocoding error:", error);
            CustomFailedToast.error(error.message || "Lỗi khi tìm kiếm địa chỉ");
        } finally {
            setIsGeocoding(false);
        }
    };

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

    const isFormValid = locationData.address && locationData.country && locationData.city && locationData.postalCode;

    const handleContinue = () => {
        sessionStorage.setItem("hotelLocation", JSON.stringify(locationData));
        nextStep();
    };

    const handleAddressSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            geocodeAddress();
        }
    };

    return (
        <div className='pt-1' style={stepContainer}>
            <CustomToast />
            <div style={contentWrapperStyle}>
                <div style={mapContainerStyle}>
                    <MapContainer
                        center={[locationData.position.lat, locationData.position.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                        <MapUpdater position={[locationData.position.lat, locationData.position.lng]} />
                    </MapContainer>
                </div>

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
                                    disabled={isGeocoding}
                                >
                                    {isGeocoding ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        'Tìm kiếm'
                                    )}
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
                                label="Cập nhật địa chỉ khi di chuyển ghim trên bản đồ."
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

                <div style={bottomButtonsStyle}>
                    <Button variant="secondary" onClick={prevStep} className="shadow">
                        Back
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className="shadow"
                    >
                        Continue
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
MapUpdater.propTypes = {
    position: PropTypes.object,
};
export default Step5;