import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/Constant";
import axios from 'axios'
import { HashLoader } from "react-spinners";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import './HistoryTransaction.css'
import { Badge, Button, Card } from "react-bootstrap";
import { formatDate } from "../../utils/FormatDatePrint";
import { dataStatus, statusColors, statusText } from "./DataStatus";

export const HistoryTransaction = () => {
   const [status, setStatus] = useState("ALL");
   const [loading, setLoading] = useState(false);
   const [reservations, setReservations] = useState([]);
   const [activeStatus, setActiveStatus] = useState("ALL");
   const [err, setErr] = useState("");
   const [hotels, setHotels] = useState({}); // Object to store hotels by reservationId

   const handleChangeStatus = (status) => {
      setStatus(status);
      setActiveStatus(status);
   };

   const fetchDataReservation = async () => {
      setLoading(true);
      try {
         const response = await axios.get(`${BASE_URL}/reservation/search-status`, {
            params: { status }
         });
         if (response.data && response.data.reservations) {
            setReservations(response.data.reservations);
            setErr("");
         }
      } catch (error) {
         setErr(error.message);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1500);
      }
   };

   const fetchHotelFromReservation = async (reservationId) => {
      try {
         const response = await axios.get(`${BASE_URL}/reservation/hotel/${reservationId}`);
         if (response.data && response.data.hotel) {
            return response.data.hotel; // Return the hotel data
         }
      } catch (error) {
         setErr(error.message);
      }
   };

   useEffect(() => {
      fetchDataReservation();
   }, [status]);

   useEffect(() => {
      // Fetch hotels for all reservations after fetching reservation data
      const fetchHotels = async () => {
         const hotelData = {};
         for (let reservation of reservations) {
            const hotel = await fetchHotelFromReservation(reservation._id);
            if (hotel) {
               hotelData[reservation._id] = hotel; // Store hotel data by reservationId
            }
         }
         setHotels(hotelData);
      };
      if (reservations.length > 0) {
         fetchHotels();
      }
   }, [reservations]);

   return (
      <>
         <CustomNavbar />
         <div className="row mt-5 d-flex container-fluid justify-content-center align-items-start">
            <div className="col-md-2">
               <div className="d-flex mt-5 flex-column" style={{ color: 'red' }}>
                  {dataStatus.map((item, index) => (
                     <div key={index} className="col-md-1 p-2">
                        <button
                           className={`${activeStatus === item ? "btn-active" : "btn-non-active"}`}
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
                        <div className="row">
                           {reservations.map((item, index) => {
                              const hotel = hotels[item._id]; // Get hotel by reservationId
                              return (
                                 <React.Fragment key={index}>
                                    {index % 2 === 0 && <div className="row mb-4"></div>}
                                    <div className={`col-md-6 ${reservations.length === 1 ? "col-md-12" : ""}`}>
                                       <Card className="card-search-hotel p-3">
                                          {hotel ? (
                                             <>
                                                <Card.Title className="text-center">{hotel.hotelName}</Card.Title>
                                                <Card.Body>
                                                   <p>📍 Address: {hotel.address}</p>
                                                   <p>🗓️ Check In Date: {formatDate(item.checkInDate, 'DD/MM/YYYY')}</p>
                                                   <p>🗓️ Check Out Date: {formatDate(item.checkOutDate, 'DD/MM/YYYY')}</p>
                                                   <p>💰 Price: {item.totalPrice}$</p>
                                                   <Badge className="py-2 px-3" bg={statusColors[item.status]}>
                                                      {statusText[item.status] || 'Unknown Status'}
                                                   </Badge>
                                                   {item.status === 'CHECKED OUT' ? (
                                                      <Button className="mx-2" variant="outline-primary">
                                                         📝 Feedback
                                                      </Button>
                                                   ) : null}
                                                   <Button className="mx-2" variant="outline-dark">
                                                      🔍 View Details
                                                   </Button>
                                                </Card.Body>
                                             </>
                                          ) : (
                                             <p>{err}</p>
                                          )}
                                       </Card>
                                    </div>
                                 </React.Fragment>
                              );
                           })}
                        </div>
                     </>
                  )}
                  <p>{err}</p>
               </div>
            </div>
         </div>
      </>
   );
};
