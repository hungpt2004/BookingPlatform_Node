import React, { useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { HiCheckCircle } from 'react-icons/hi';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CustomFailedToast, CustomSuccessToast, CustomToast } from "../../components/toast/CustomToast";
import axiosInstance from "../../utils/AxiosInstance";

export const SuccessPaymentPage = () => {
  const navigate = useNavigate(); 

  const { id } = useParams(); // Lấy id từ URL dạng /success/:id
  const [searchParams] = useSearchParams(); 
  const cancelStatus = searchParams.get('cancel');
  const statusPayment = searchParams.get('status');

  useEffect(() => {
    const successPaymentAction = async () => {
      try {
        const response = await axiosInstance.post(`payment/success/${id}`);
        if(response.data?.message) {
          CustomSuccessToast(response.data.message);
        }
      } catch (err) {
        CustomFailedToast(err.response?.data?.message || "Payment failed.");
      }
    };

    // Kiểm tra điều kiện trước khi gọi API
    if (cancelStatus === "false" && statusPayment === "PAID") {
      successPaymentAction();
    }
  }, [id, cancelStatus, statusPayment]); // Đưa các biến vào dependency array

  return (
    <>
      <CustomToast />
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Card className="text-center p-4 shadow-lg">
          <Card.Body>
            {/* Biểu tượng checkmark */}
            <HiCheckCircle className="text-success mb-3" size={60} />

            <Card.Title className="fw-bold">Payment Successful! {id}</Card.Title>
            <Card.Text className="text-muted">
              Thank you for your purchase. Your transaction has been completed successfully.
            </Card.Text>

            {/* Nút Back */}
            <Button variant="primary" onClick={() => navigate("/home")}>
              Back to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
