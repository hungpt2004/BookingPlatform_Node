import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { renderPersonIcon } from "../../utils/RenderPersonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faUser } from '@fortawesome/free-regular-svg-icons';
import { FaSmokingBan, FaBroom } from "react-icons/fa";
const RoomCards = ({ roomQuantities }) => {
    const [guestNames, setGuestNames] = useState({});

    // Get random facility or default to Free WiFi
    const handleGuestNameChange = (roomId, name) => {
        setGuestNames(prev => ({
            ...prev,
            [roomId]: name
        }));
    };

    return (
        <div className="mt-3">
            {roomQuantities.map((room) => (
                <Card key={room._id} className="mb-3 shadow-sm">
                    <Card.Body>
                        <Card.Title className="fs-5 fw-bold mb-3">
                            {room.type}
                        </Card.Title>


                        <Card.Text className="d-flex align-items-center mb-2">
                            <span className="text-success me-2">✓</span>
                            <span className="text-success me-1">Free WiFi</span>
                            <span className="text-primary">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </span>

                        </Card.Text>

                        <Card.Text className="d-flex align-items-center mb-2">
                            <span className="text-success me-2">✓</span>
                            <span className="text-success me-1">Free cancellation anytime</span>
                            <span className="text-primary">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </span>

                        </Card.Text>

                        <Card.Text className="d-flex align-items-center mb-3">
                            <span className="me-2"><FontAwesomeIcon icon={faUser} className="me-2" />Capacity:</span>
                            <span className="me-1">
                                {room.capacity} person
                            </span>
                            <span className="text-primary">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </span>
                        </Card.Text>

                        <Card.Text className="d-flex align-items-center mb-2">
                            <span className="me-2 text-muted"><FaBroom className="me-2" />Extremely clean room - 8.9</span>
                        </Card.Text>

                        <Card.Text className="d-flex align-items-center mb-2">
                            <span className="me-2 text-muted"><FaSmokingBan className="me-2" />No Smoking</span>
                        </Card.Text>

                        <div className="mb-3 w-50">
                            <label className="form-label">Guest Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={guestNames[room._id] || ""}
                                onChange={(e) => handleGuestNameChange(room._id, e.target.value)}
                                placeholder="Enter guest name"
                            />
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default RoomCards;