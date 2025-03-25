import { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import CustomNavbar from "../../components/navbar/CustomNavbar";
import {
    CreatehotelStep1, CreatehotelStep2, CreatehotelStep3,
    CreatehotelStep4, CreatehotelStep5, CreatehotelStep6,
    CreatehotelStep7,
    CreatehotelStep8,
    CreatehotelStep9,
    CreatehotelStep15,
    CreatehotelStep10,
    CreatehotelStep11
} from '../../components/hotel_slide';
import axiosInstance from "../../utils/AxiosInstance";
import { CustomFailedToast } from "../../components/toast/CustomToast";
import OwnerSidebar from "../../components/navbar/OwnerSidebar";
import { OwnerCustomNavbar } from "../../components/navbar/OwnerCustomNavbar";
export const Createhotel = () => {
    const [step, setStep] = useState(() => Number(sessionStorage.getItem("hotelStep")) || 1);
    const [selectedHotel, setSelectedHotel] = useState(() => {
        const savedHotel = sessionStorage.getItem("selectedHotel");
        return savedHotel ? JSON.parse(savedHotel) : { id: 1, title: '1 khách sạn với nhiều phòng' };
    });
    const [user, setUser] = useState(null);
    const handleSelectedHotel = (hotelData) => {
        setSelectedHotel(hotelData);
        sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));
    };

    useEffect(() => {
        sessionStorage.setItem("hotelStep", step);
    }, [step]);

    useEffect(() => {
        checkHotelOwner(); // Gọi API khi component mount
    }, []);

    const checkHotelOwner = async () => {
        try {
            // Fetch the latest user data
            const response = await axiosInstance.get('/customer/current-user');
            const updatedUser = response.data.user;
            setUser(updatedUser); // Update the local state

        } catch (error) {
            console.error('Error fetching user:', error);
            CustomFailedToast("Có lỗi xảy ra khi kiểm tra thông tin");
        }
    }
    const steps = [
        <CreatehotelStep1 key={1} nextStep={() => setStep(step + 1)} />,
        <CreatehotelStep2 key={2} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep3 key={3} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} selectedHotel={handleSelectedHotel} />,
        <CreatehotelStep4 key={4} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} hotelType={selectedHotel} />,
        <CreatehotelStep5 key={5} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep6 key={6} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep7 key={7} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        // <CreatehotelStep8 key={8} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep9 key={9} nextStep={() => setStep(step + 1)} prevStep={() => setStep(5)} />,
        <CreatehotelStep10 key={10} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep11 key={11} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep15 key={12} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />
    ];

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Render OwnerSidebar chỉ khi user.role là OWNER */}
            {user?.role === "OWNER" && (
                <div >
                    <OwnerSidebar />
                </div>
            )}
            <div className="flex-grow-1">
                {/* Render OwnerCustomNavbar chỉ khi user.role là OWNER */}
                {user?.role === "OWNER" && <OwnerCustomNavbar />}
                {user?.role === "CUSTOMER" && <CustomNavbar />}
                <div className="container-fluid justify-content-center mb-0">
                    <ProgressBar now={(step / steps.length) * 100} label={`${Math.round((step / steps.length) * 100)}%`} />
                    {steps[step - 1]}
                </div>
            </div>
        </div>

    );
}
