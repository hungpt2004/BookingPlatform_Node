import React, { useState } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { FaCheckCircle, FaImage, FaBook, FaChevronUp } from "react-icons/fa";
import BedSvg from "../../../public/bed.svg";
import BedImg from "../../../public/bedroom.jpg";
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom";

export const Step9 = ({ nextStep, prevStep }) => {
    const navigate = useNavigate();
    // Retrieve data from sessionStorage
    const [rooms, setRooms] = useState(JSON.parse(sessionStorage.getItem("rooms")) || []);
    console.log(rooms.bedTypes);
    const [photos, setPhotos] = useState(JSON.parse(sessionStorage.getItem("hotelPhotos")) || []);

    const toCreateRoom = () => {
        if (sessionStorage.getItem("id")) {
            ["roomDetails", "comfortOptions", "price", "bathroomData", "roomName",
                "groupDiscounts", "nonRefundableSettings", "weeklyPricingSettings", "cancelPolicy", "id"]
                .forEach(key => sessionStorage.removeItem(key));
        }

        navigate("/create-room");
    }

    const DeleteRoom = (idx) => {
        let storedRooms = JSON.parse(sessionStorage.getItem("rooms")) || [];
        storedRooms.splice(idx, 1);
        sessionStorage.setItem("rooms", JSON.stringify(storedRooms));
        setRooms(storedRooms);
    };

    const setRoomSession = (room) => {
        Object.keys(room).forEach((key) => {
            sessionStorage.setItem(key, key === "roomName" ? room[key] : JSON.stringify(room[key]));
        })
    }

    const toEditRoom = (room) => {
        setRoomSession(room);
        navigate("/create-room");
    }

    const toCreatePhoto = () => {
        navigate("/create-photo");
    }

    const validPhoto = photos.length >= 1; // 1 photos due to insufficent space 

    const isValidInfo = () => {
        return rooms.length > 0 && validPhoto;
    }
    return (
        <Container style={{ maxWidth: "65%" }} >
            {/* Basic Information Section */}
            <Card className="p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <span><FaCheckCircle className="text-success me-2" size={50} /></span>
                        <div>
                            <p className="mb-0 text-muted">
                                Bước 1
                            </p>
                            <h5 className="fw-bold me-1">Thông tin chỗ nghỉ</h5>
                            <p className="mb-0 text-muted">
                                Các thông tin cơ bản. Nhập tên chỗ nghỉ, địa chỉ, tiện nghi và nhiều hơn nữa.
                            </p>
                        </div>
                    </div>
                    <Button variant="link" className="text-decoration-none" onClick={prevStep}>
                        Chỉnh sửa
                    </Button>
                </div>
            </Card>

            {/* Rooms Section */}
            <Card className="p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">

                    <div className="d-flex align-items-center">
                        {rooms.length > 0 ? (
                            <span><FaCheckCircle className="text-success me-2" size={50} /></span>
                        ) : (
                            <span>
                                <img src={BedSvg} className="me-2 bg-black" width={50} height={50} />
                            </span>
                        )}
                        <div>
                            <p className="mb-0 text-muted">
                                Bước 2
                            </p>
                            {rooms.length > 0 ? (
                                <div>
                                    <h5 className="fw-bold mb-0">Phòng</h5>
                                    <p className="mb-2 me-1 text-muted">Thêm phòng khác để thêm bố cục, lựa chọn giường và mức giá mới.
                                    </p>
                                </div>)
                                : (
                                    <h5 className="fw-bold mb-2">Thêm phòng</h5>
                                )}

                            {rooms.length > 0 ? (
                                rooms.map((room, index) => {
                                    const bedCount = room.roomDetails.bedTypes.reduce((acc, bed) => acc + bed.count, 0)
                                    return (
                                        <>
                                            <div className="d-flex align-items-center mb-2">
                                                <img src={BedImg} className="me-2" width={95} height={100} />
                                                <div className="w-100 me-2">
                                                    <h5 className="ms-2 fw-bold mb-0">{room.roomName}</h5>
                                                    <Table key={index} className="mb-1 ">
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted fw-bold">Lượng khách</td>
                                                                <td className="text-muted  fw-bold">Giường</td>
                                                                {/* <td className="text-muted  fw-bold">Phòng tắm</td> */}
                                                                <td className="text-muted  fw-bold">Giá</td>
                                                                <td className="text-muted  fw-bold">Phòng loại này</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">{room.roomDetails.capacity}</td>
                                                                <td className="text-muted"> {bedCount}</td>
                                                                {/* <td className="text-muted"> {room.bathroomData.isPrivateBathroom ? "Riêng" : "Chung"}</td> */}
                                                                <td className="text-muted"> {room.price} VNĐ</td>
                                                                <td className="text-muted"> {room.roomDetails.roomQuantity}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>

                                                </div>
                                                <Button variant="link" className="text-decoration-none me-2" onClick={() => DeleteRoom(index)}>
                                                    Xóa
                                                </Button>
                                                <Button variant="link" className="text-decoration-none" onClick={() => toEditRoom(room)}>
                                                    Chỉnh sửa
                                                </Button>
                                            </div>

                                        </>
                                    )
                                })
                            ) : (
                                <p className="mb-0 me-1 text-muted">Hãy cho chúng tôi biết về phòng đầu tiên của Quý vị. Sau khi đã thiết lập xong một căn, Quý vị có thể thêm nhiều căn nữa.
                                </p>
                            )}

                        </div >
                    </div>
                    {rooms.length > 0 ? (
                        ""
                    ) : (
                        <Button variant="primary" onClick={toCreateRoom}>
                            Thêm phòng
                        </Button>
                    )}
                </div>
                {rooms.length > 0 && (
                    <Button variant="outline-primary" className="align-self-end" onClick={toCreateRoom}>
                        Thêm phòng
                    </Button>
                )}

            </Card>

            {/* Photos Section */}
            <Card className="p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        {validPhoto ? (
                            <span><FaCheckCircle className="text-success me-2" size={50} /></span>
                        ) : (
                            <span><FaImage className="me-2" size={50} style={{ color: "#1A1A1A" }} /></span>
                        )}
                        <div>
                            <p className="mb-0 text-muted">
                                Bước 3
                            </p>
                            <h5 className="fw-bold mb-0">Ảnh</h5>
                            <p className="mb-0 text-muted">
                                Chia sẻ một số hình ảnh chỗ nghỉ của Quý vị để khách biết mình nên có những kỳ vọng gì.
                            </p>

                        </div>
                    </div>
                    {photos.length > 0 ? (
                        <Button variant="link" className="text-decoration-none" onClick={toCreatePhoto}>
                            Chỉnh sửa
                        </Button>

                    ) : (
                        <Button variant="primary" onClick={toCreatePhoto}>
                            Thêm ảnh
                        </Button>
                    )}
                </div>
            </Card>

            {/* Payment Section */}
            <Card className="p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <span><FaBook className="me-2" size={50} style={{ color: "#1A1A1A" }} /></span>
                        <div>
                            <p className="mb-0 text-muted">
                                Bước 4
                            </p>
                            <h5 className="fw-bold mb-0">Những bước cuối cùng</h5>
                            <p className="mb-0 text-muted">
                                Nhập thông tin thanh toán và hóa đơn trước khi mở để nhận đặt phòng.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline-primary" className="fw-medium" onClick={nextStep} disabled={!isValidInfo()}>
                        Thêm các thông tin cuối cùng
                    </Button>
                </div>
            </Card>

        </Container >
    );
};

Step9.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
}
