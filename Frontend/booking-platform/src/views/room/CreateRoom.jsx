import { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { CreateRoomStep1, CreateRoomStep3, CreateRoomStep4, CreateRoomStep5 } from "../../components/room_slide";
export const CreateRoom = () => {
    // Keep track of the current step for the room flow
    const [step, setStep] = useState(() => Number(sessionStorage.getItem("roomStep")) || 1);

    // Whenever the step changes, store it in sessionStorage
    useEffect(() => {
        sessionStorage.setItem("roomStep", step);
    }, [step]);

    // Define your steps array (currently just Step1, but you can add more)
    const steps = [
        <CreateRoomStep1 key={1} nextStep={() => setStep(step + 1)} />,
        // <CreateRoomStep2 key={2} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreateRoomStep3 key={2} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreateRoomStep4 key={3} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        <CreateRoomStep5 key={4} nextStep={() => setStep(step + 1)} prevStep={() => setStep(step - 1)} />,
        // <CreateRoomStep6 key={5} prevStep={() => setStep(step - 1)} />
    ];

    return (
        <>
            <CustomNavbar />
            <div className="container-fluid mt-3 p-0 justify-content-center">
                {/* Progress Bar */}
                <ProgressBar
                    now={(step / steps.length) * 100}
                    label={`${Math.round((step / steps.length) * 100)}%`}
                />
                {/* Render the current step */}
                {steps[step - 1]}
            </div>
        </>
    );
};
