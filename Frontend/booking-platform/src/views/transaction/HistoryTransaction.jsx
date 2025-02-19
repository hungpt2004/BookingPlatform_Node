import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Pagination, Row, Spinner } from "react-bootstrap";
import "./HistoryTransaction.css";
import { Badge, Button, Card } from "react-bootstrap";
import { formatDate } from "../../utils/FormatDatePrint";
import { dataStatus, statusColors, statusText } from "./DataStatus";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import axiosInstance from "../../utils/AxiosInstance";


export const HistoryTransaction = () => {
   const [status, setStatus] = useState("ALL");
   const [loading, setLoading] = useState(false);
   const [reservations, setReservations] = useState([]);
   const [activeStatus, setActiveStatus] = useState("ALL");
   const [err, setErr] = useState("");
   const [hotels, setHotels] = useState({});
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1); // Thêm state tổng số trang
   const [showFeedback, setShowFeedback] = useState(false);
   const [selectedReservationId, setSelectedReservationId] = useState(null);

   const handleChangeStatus = (newStatus) => {
      setStatus(newStatus);
      setActiveStatus(newStatus);
      setPage(1);
   };


   const fetchDataReservation = async () => {
      setLoading(true);
      try {
         const response = await axiosInstance.get(`/reservation/search-status`, {
            params: { status, page }
         });

         if (response.data && response.data.reservations) {
            console.log(response.data)
            setReservations(response.data.reservations);
            setTotalPages(response.data.totalPages || 1);
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

   // Add this function to handle feedback submission
   const handleFeedbackSubmitted = () => {
      fetchDataReservation(); // Refresh the list
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
                                          <p>📍 Address: {item.hotel.address || "N/A"}</p>
                                          <p>🗓️ Check In: {formatDate(item.checkInDate, "DD/MM/YYYY")}</p>
                                          <p>🗓️ Check Out: {formatDate(item.checkOutDate, "DD/MM/YYYY")}</p>
                                          <p>💰 Price: {item.totalPrice}$</p>
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
                                          {item.status === "BOOKED" && (
                                             <Button className="mb-1" variant="outline-danger">
                                                Cancel
                                             </Button>
                                          )}
                                          <Button className="" variant="outline-dark">
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
      </>
   );
};
