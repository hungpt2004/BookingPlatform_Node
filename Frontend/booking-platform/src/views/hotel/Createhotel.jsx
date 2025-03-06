import { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import CustomNavbar from "../../components/navbar/CustomNavbar";
import {
    CreatehotelStep1, CreatehotelStep2, CreatehotelStep3,
    CreatehotelStep4, CreatehotelStep5, CreatehotelStep6,
    CreatehotelStep7, CreatehotelStep15
} from '../../components/hotel_slide';

export const Createhotel = () => {
    const [step, setStep] = useState(() => Number(sessionStorage.getItem("hotelStep")) || 1);

    const [selectedHotel, setSelectedHotel] = useState(() => {
        const savedHotel = sessionStorage.getItem("selectedHotel");
        return savedHotel ? JSON.parse(savedHotel) : { id: 1, title: '1 khách sạn với nhiều phòng' };
    });

    const handleSelectedHotel = (hotelData) => {
        setSelectedHotel(hotelData);
        sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));
    };

    useEffect(() => {
        sessionStorage.setItem("hotelStep", step);
    }, [step]);

    const steps = [
        <CreatehotelStep1 key={1} nextStep={() => setStep(step + 1)} />,
        <CreatehotelStep2 key={2} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep3 key={3} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} selectedHotel={handleSelectedHotel} />,
        <CreatehotelStep4 key={4} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} hotelType={selectedHotel} />,
        <CreatehotelStep5 key={5} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep6 key={6} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep7 key={7} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreatehotelStep15 key={8} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />
    ];

    return (
        <>
            <CustomNavbar />
            <div className="container-fluid mt-3 p-0  justify-content-center">
                <ProgressBar now={(step / steps.length) * 100} label={`${Math.round((step / steps.length) * 100)}%`} />
                {steps[step - 1]}
            </div>
        </>
    );
};
