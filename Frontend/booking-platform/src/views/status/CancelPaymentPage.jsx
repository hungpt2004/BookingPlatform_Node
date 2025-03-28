import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import { CustomFailedToast, CustomSuccessToast, CustomToast } from "../../components/toast/CustomToast";
import { Card, Container, Button } from "react-bootstrap";
import { MdCancel } from "react-icons/md";
import axiosInstance from "../../utils/AxiosInstance";

const CancelPaymentPage = () => {
  const navigate = useNavigate();

  const { id } = useParams(); // Lấy id từ URL dạng /success/:id
  const [searchParams] = useSearchParams();
  const cancelStatus = searchParams.get('cancel');
  const statusPayment = searchParams.get('status');

  useEffect(() => {
    let isMounted = true; // Cờ kiểm tra component đã unmount chưa
    const successCancelPaymentAction = async () => {
      try {
        const response = await axiosInstance.post(`payment/cancel/${id}`);
        if (response.data?.message && response.data) {
          CustomSuccessToast(response.data.message);
          sessionStorage.removeItem('payment_link')
          console.log("Đã hủy thanh toán")
          setTimeout(() => {
            if (isMounted) navigate("/home");
          }, 3000);
        }
      } catch (err) {
        // if(err.response.data.message || isMounted) {
        //   CustomFailedToast(err.response?.data?.message || "Cancel payment failed.");
        // }
      }
    };

    // Kiểm tra điều kiện trước khi gọi API
    if (cancelStatus === "true" && statusPayment === "CANCELLED") {
      successCancelPaymentAction();
    }
  }, []); // Đưa các biến vào dependency array

  console.log("Trước khi xóa:", sessionStorage.getItem('payment_link'));
  sessionStorage.removeItem('payment_link');
  console.log("Sau khi xóa:", sessionStorage.getItem('payment_link'));

  return (
    <>
      <CustomToast />
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Card className="text-center p-4 shadow-lg">
          <Card.Body>
            {/* Biểu tượng checkmark */}
            <MdCancel className="text-danger mb-3" size={60} />

            <Card.Title className="fw-bold">Cancel Payment Success</Card.Title>
            <Card.Text className="text-muted">
              If you have some changes. You can choose again !
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

export default CancelPaymentPage;
