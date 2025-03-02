import { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { CreatehotelStep1, CreatehotelStep2, CreatehotelStep3, CreatehotelStep4, CreatehotelStep5, CreatehotelStep6, CreatehotelStep7 } from '../../components/hotel_slide';

export const Createhotel = () => {
    // Đọc bước hiện tại từ sessionStorage, nếu không có thì mặc định là 1
    const [step, setStep] = useState(() => {
        return Number(sessionStorage.getItem("hotelStep")) || 1;
    });

    // Lưu thông tin khách sạn đã chọn vào state từ sessionStorage
    const [selectedHotel, setSelectedHotel] = useState(() => {
        const savedHotel = sessionStorage.getItem("selectedHotel");
        return savedHotel ? JSON.parse(savedHotel) : {
            id: 1, title: '1 khách sạn với nhiều phòng'
        };
    });

    // Handle setting selected hotel data and save to sessionStorage
    const handleSelectedHotel = (hotelData) => {
        setSelectedHotel(hotelData);
        sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));
    };

    useEffect(() => {
        sessionStorage.setItem("hotelStep", step); // Cập nhật sessionStorage mỗi khi step thay đổi
    }, [step]);

    const steps = 5;
    const progress = (step / steps) * 100;

    return (
        <>
            <CustomNavbar />
            <div className="container mt-3">
                <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
                {step === 1 && <CreatehotelStep1 nextStep={() => setStep(2)} />}
                {step === 2 && <CreatehotelStep2 nextStep={() => setStep(3)} prevStep={() => setStep(1)} />}
                {step === 3 && (
                    <CreatehotelStep3
                        nextStep={() => setStep(4)}
                        prevStep={() => setStep(2)}
                        selectedHotel={handleSelectedHotel}
                    />
                )}
                {step === 4 && (
                    <CreatehotelStep4
                        nextStep={() => setStep(5)}
                        prevStep={() => setStep(2)}
                        hotelType={selectedHotel}
                    />
                )}
                {step === 6 && <CreatehotelStep6
                    nextStep={() => setStep(7)}
                    prevStep={() => setStep(5)}

                />}
                {step === 7 && <CreatehotelStep7
                    nextStep={() => setStep(8)}
                    prevStep={() => setStep(6)}

                />}
            </div>
            <div style={{ width: "100%" }}>
                {step === 5 && <CreatehotelStep5
                    prevStep={() => setStep(4)}
                    nextStep={() => setStep(6)}
                />}
            </div>
        </>
    );
};