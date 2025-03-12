import React, { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Pagination, Row, Spinner } from "react-bootstrap";
import "./HistoryTransaction.css";
import { Badge, Button, Card, Modal, Alert } from "react-bootstrap";
import { formatDate } from "../../utils/FormatDatePrint";
import { dataStatus, statusColors, statusText } from "./DataStatus";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import axiosInstance from "../../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";


export const HistoryTransaction = () => {
   const [status, setStatus] = useState("ALL");
   const [loading, setLoading] = useState(false);
   const [reservations, setReservations] = useState([]);
   const [activeStatus, setActiveStatus] = useState("ALL");
   const [err, setErr] = useState("");
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1); // Thêm state tổng số trang
   const [showFeedback, setShowFeedback] = useState(false);
   const [selectedReservationId, setSelectedReservationId] = useState(null);
   const [paymentLink, setPaymentLink] = useState('')
   const [showErrorModal, setShowErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [showCancellationModal, setShowCancellationModal] = useState(false);
   const [selectedReservation, setSelectedReservation] = useState(null);
   const [cancellationStep, setCancellationStep] = useState(1);
   const [cancellationStatus, setCancellationStatus] = useState('idle');

   const handleChangeStatus = (newStatus) => {
      setStatus(newStatus);
      setActiveStatus(newStatus);
      setPage(1);
   };

   const handleCancelReservation = async (reservationId) => {
      try {
         setCancellationStatus('processing');
         const response = await axiosInstance.post(`/reservation/cancel/${reservationId}`);

         if (response.data && !response.data.error) {
            setCancellationStatus('success');
            setTimeout(() => {
               closeCancellationModal();
               fetchDataReservation();
            }, 3000);
         } else {
            setErrorMessage(response.data.message || "Failed to cancel reservation");
            setCancellationStatus('error');
         }
      } catch (error) {
         console.error("Cancel error:", error);
         setErrorMessage(error.response?.data?.message || "An error occurred while cancelling");
         setCancellationStatus('error');
      }
   };

   const canCancelReservation = (checkInDate) => {
      const checkIn = new Date(checkInDate);
      const now = new Date();
      const daysUntilCheckIn = Math.floor((checkIn - now) / (1000 * 60 * 60 * 24));
      return daysUntilCheckIn >= 1; 
   };

   const openCancellationModal = (reservation) => {
      setSelectedReservation(reservation);
      setCancellationStatus('idle'); 
      setShowCancellationModal(true);
   };

   const closeCancellationModal = () => {
      setShowCancellationModal(false);
      setCancellationStep(1);
      setSelectedReservation(null);
   };

   const fetchDataReservation = async () => {
      setLoading(true);
      try {
         const response = await axiosInstance.get(`/reservation/search-status`, {
            params: { status, page },
            withCredentials: true
         });

         if (response.data && response.data.reservations) {
            console.log(response.data)
            setReservations(response.data.reservations);
            setTotalPages(response.data.totalPages || 1);
            setPaymentLink(sessionStorage.getItem('payment_link'))
            setErr("");
         }
      } catch (error) {
         setErr(error.message);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   useEffect(() => {
      fetchDataReservation();
   }, [status, page]);

   useEffect(() => {
      setTimeout(() => {
         sessionStorage.removeItem('payment_link')
      }, 50000)
   }, [])

   // Add this function to handle feedback submission
   const handleFeedbackSubmitted = () => {
      fetchDataReservation(); // Refresh the list
   };
   
   const getCancellationDetails = () => {
      if (!selectedReservation) return { canCancel: false };

      const checkInDate = new Date(selectedReservation.checkInDate);
      const currentDate = new Date();
      const daysUntilCheckIn = Math.floor((checkInDate - currentDate) / (1000 * 60 * 60 * 24));

      let refundPercentage = 0;
      let refundAmount = 0;
      let cancellationFee = 0;
      let canCancel = true;

      if (daysUntilCheckIn >= 5) {
         refundPercentage = 100;
         refundAmount = selectedReservation.totalPrice;
         cancellationFee = 0;
      } else if (daysUntilCheckIn >= 3) {
         refundPercentage = 50;
         refundAmount = selectedReservation.totalPrice * 0.5;
         cancellationFee = selectedReservation.totalPrice * 0.5;
      } else if (daysUntilCheckIn >= 1) {
         refundPercentage = 0;
         refundAmount = 0;
         cancellationFee = selectedReservation.totalPrice;
      } else {
         canCancel = false;
      }

      return {
         daysUntilCheckIn,
         refundPercentage,
         refundAmount,
         cancellationFee,
         canCancel
      };
   };

   const renderCancellationModal = () => {
      if (!selectedReservation) return null;

      const policy = getCancellationDetails();

      return (
         <Modal
            show={showCancellationModal}
            onHide={closeCancellationModal}
            centered
            backdrop="static"
            size="lg"
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  {cancellationStatus === 'success' ? 'Cancellation Complete' : 'Cancel Reservation'}
               </Modal.Title>
            </Modal.Header>

            <Modal.Body>
               {cancellationStatus === 'processing' ? (
                  <div className="text-center py-4">
                     <Spinner animation="border" role="status" className="me-2" />
                     <span>Processing cancellation...</span>
                  </div>
               ) : cancellationStatus === 'success' ? (
                  <div className="alert alert-success fade-in">
                     <div className="d-flex align-items-center">
                        <div className="success-checkmark me-3">
                           <svg className="checkmark" viewBox="0 0 52 52">
                              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                           </svg>
                        </div>
                        <div>
                           <h5 className="alert-heading">Cancellation Successful!</h5>
                           {selectedReservation.cancellationPolicy?.refundAmount > 0 ? (
                              <p className="mb-0">
                                 A refund of ${selectedReservation.cancellationPolicy.refundAmount.toFixed(2)}
                                 will be processed within 5-7 business days. A confirmation email has been sent.
                              </p>
                           ) : (
                              <p className="mb-0">
                                 No refund will be issued per our cancellation policy.
                                 We hope to serve you better next time.
                              </p>
                           )}
                        </div>
                     </div>
                  </div>
               ) : cancellationStatus === 'error' ? (
                  <div className="alert alert-danger">
                     <h5 className="alert-heading">Cancellation Failed</h5>
                     <p>{errorMessage}</p>
                  </div>
               ) : (
                  <>
                     <div className="mb-4">
                        <h5 className="fw-bold mb-3">Reservation Details</h5>
                        <div className="row">
                           <div className="col-6">
                              <p className="mb-1"><span className="text-muted">Hotel:</span> {selectedReservation.hotel?.hotelName || 'N/A'}</p>
                              <p className="mb-1"><span className="text-muted">Check-in:</span> {formatDate(selectedReservation.checkInDate, "DD/MM/YYYY")}</p>
                           </div>
                           <div className="col-6">
                              <p className="mb-1"><span className="text-muted">Total:</span> ${selectedReservation.totalPrice}</p>
                              <p className="mb-1"><span className="text-muted">Status:</span> <Badge bg={statusColors[selectedReservation.status]} className="badge-sm">
                                 {statusText[selectedReservation.status]}
                              </Badge></p>
                           </div>
                        </div>
                     </div>

                     {policy.canCancel ? (
                        <>
                           <div className="border-top pt-3">
                              <h5 className="fw-bold mb-3">Cancellation Policy</h5>
                              <div className={`alert ${policy.daysUntilCheckIn >= 5 ? 'alert-success' : policy.daysUntilCheckIn >= 3 ? 'alert-warning' : 'alert-danger'}`}>
                                 {policy.daysUntilCheckIn >= 5 ? "Full refund available" :
                                    policy.daysUntilCheckIn >= 3 ? "50% refund available" :
                                       "No refund available"}
                              </div>

                              <div className="row mb-3">
                                 <div className="col-6">
                                    <p className="mb-1"><span className="text-muted">Days until check-in:</span> {policy.daysUntilCheckIn}</p>
                                    <p className="mb-1"><span className="text-muted">Refund amount:</span> ${policy.refundAmount.toFixed(2)}</p>
                                 </div>
                                 <div className="col-6">
                                    {policy.cancellationFee > 0 && (
                                       <p className="mb-1"><span className="text-muted">Cancellation fee:</span> ${policy.cancellationFee.toFixed(2)}</p>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="border-top pt-3">
                              <p className="text-muted small">
                                 By proceeding, you agree to our cancellation terms. Refunds are processed
                                 to your original payment method within 5-7 business days.
                              </p>
                           </div>
                        </>
                     ) : (
                        <div className="alert alert-danger">
                           <strong>Cancellation unavailable:</strong> This reservation can no longer
                           be canceled online. Please contact customer support for assistance.
                        </div>
                     )}
                  </>
               )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
               {cancellationStatus === 'idle' && (
                  <>
                     <Button
                        variant="outline-secondary"
                        onClick={closeCancellationModal}
                     >
                        Close
                     </Button>
                     {policy.canCancel && (
                        <Button
                           variant="danger"
                           onClick={() => handleCancelReservation(selectedReservation._id)}
                        >
                           Confirm Cancellation
                        </Button>
                     )}
                  </>
               )}

               {(cancellationStatus === 'success' || cancellationStatus === 'error') && (
                  <Button
                     variant="secondary"
                     onClick={closeCancellationModal}
                  >
                     Close
                  </Button>
               )}
            </Modal.Footer>
         </Modal>
      );
   };


   return (
      <>
         <CustomNavbar />
         <div className="row mt-5 d-flex container-fluid justify-content-center align-items-start">
            <div className="col-md-2">
               <div className="d-flex mt-5 flex-column" style={{ color: "red" }}>
                  {dataStatus.map((item, index) => (
                     <div key={index} className="col-md-1 p-2">
                        <button
                           className={
                              activeStatus === item ? "btn-active" : "btn-non-active"
                           }
                           onClick={() => handleChangeStatus(item)}
                        >
                           {item}
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            <div className="col-md-8">
               <div className="d-flex justify-content-center align-items-center">
                  {loading ? (
                     <HashLoader className="mt-5" size={50} color="#6499E9" />
                  ) : (
                     <>
                        <div className="d-flex flex-column">
                           <div className="d-flex justify-content-center mt-3">
                              <Pagination>
                                 <Pagination.Prev
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                 />
                                 {[...Array(totalPages)].map((_, index) => {
                                    return (
                                       <Pagination.Item
                                          key={index + 1}
                                          active={page === index + 1}
                                          onClick={() => setPage(index + 1)}
                                       >
                                          {index + 1}
                                       </Pagination.Item>
                                    )
                                 })}
                                 <Pagination.Next
                                    disabled={page === totalPages}
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                 />
                              </Pagination>
                           </div>
                           <div className="row">
                              {reservations.length > 0 ? (reservations.map((item, index) => {
                                 const canCancel = canCancelReservation(item.checkInDate);
                                 return <div key={index} className={`
                                    ${reservations.length === 1
                                       ? "col-md-12"
                                       : reservations.length === 2
                                          ? "col-md-6"
                                          : "col-md-4"
                                    }`
                                 }>
                                    <Card className="card-search-hotel p-3 m-3">
                                       <Card.Title className="text-center">{item.hotel.hotelName || "Unknown Hotel"}</Card.Title>
                                       <Card.Body>
                                          <p style={{
                                             display: '-webkit-box',
                                             WebkitBoxOrient: 'vertical',
                                             WebkitLineClamp: 1,
                                             overflow: 'hidden',
                                          }}>Address: {item.hotel.address || "N/A"}</p>
                                          <p>Check In: {formatDate(item.checkInDate, "DD/MM/YYYY")}</p>
                                          <p>Check Out: {formatDate(item.checkOutDate, "DD/MM/YYYY")}</p>
                                          <p>Price: {formatCurrencyVND(item.totalPrice)}</p>
                                          <Badge className="badge-status py-2 px-3" bg={statusColors[item.status]}>
                                             {statusText[item.status] || "Unknown Status"}
                                          </Badge>
                                       </Card.Body>
                                       <Row className="m-2">
                                          {item.status === "CHECKED OUT" && (
                                             <Button
                                                className="mb-1"
                                                variant="outline-primary"
                                                onClick={() => {
                                                   setShowFeedback(true)
                                                   setSelectedReservationId(item._id);
                                                }}
                                             >
                                                Feedback
                                             </Button>
                                          )}
                                          {paymentLink ? (
                                             (item.status === "NOT PAID" && (
                                                <Button
                                                   onClick={() => {
                                                      if (paymentLink) {
                                                         window.location.href = paymentLink;
                                                      } else {
                                                         alert("Payment link is not available!");
                                                      }
                                                   }}
                                                   className="mb-1"
                                                   variant="outline-warning"
                                                >
                                                   Continue payment
                                                </Button>
                                             ))
                                          ) : null}
                                          {item.status === "BOOKED" && (
                                             canCancel ? (
                                                <Button
                                                   className="mb-1"
                                                   variant="outline-danger"
                                                   onClick={() => openCancellationModal(item)}
                                                >
                                                   Cancel
                                                </Button>
                                             ) : (
                                                <Badge className="badge-status mb-1" bg="warning">
                                                   Cannot Cancel (Less than 24h to check-in)
                                                </Badge>
                                             )
                                          )}
                                          <Button className="mt-1" variant="outline-dark">
                                             View Details
                                          </Button>
                                       </Row>
                                    </Card>
                                 </div>
                              })) : <p className="alert alert-danger w-100">No have any transaction</p>}
                           </div>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>

         <FeedbackModal
            show={showFeedback}
            onClose={() => {
               setShowFeedback(false);
               setSelectedReservationId(null);
               // Add this prop
            }}
            reservationId={selectedReservationId}
         />

         <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Cancellation Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMessage}</Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>

         {renderCancellationModal()}
      </>
   );
};