import React, { useState, useEffect } from "react";
import { Card, Container, Alert, Form, InputGroup } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";
import axiosInstance from "../../utils/AxiosInstance";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";

// Dashboard Overview Component
export const DashboardOverview = () => {
   const [dashboardData, setDashboardData] = useState({
     totalReservations: 0,
     revenue: 0,
     activeHotels: 0,
     pendingBookings: 0,
     revenueData: [],
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
   useEffect(() => {
     const fetchDashboardData = async () => {
       try {
 
         const response = await axiosInstance('/monthly-payment');
         
         console.log(response.data);

         if(response.data){
           setDashboardData({
             totalReservations: response.data.totalReservationAmount,
             revenue: formatCurrencyVND(response.data.totalRevenue),
             activeHotels: response.data.activeHotel,
             successBooking: response.data.normalReservations,
             pendingBookings: response.data.cancelReservation,
             revenueData: response.data.averageMonthlyRevenue,
           });
         }
         setLoading(false);
       } catch (err) {
         setError("Failed to load dashboard data");
         setLoading(false);
       }
     };
 
     fetchDashboardData();
   }, []);
 
   const chartData = {
     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
     datasets: [
       {
         label: "Revenue",
         data: dashboardData.revenueData,
         borderColor: "#6499E9", // Primary brand color
         backgroundColor: "rgba(100, 153, 233, 0.1)",
         fill: true,
       },
     ],
   };
 
   if (loading)
     return <div className="p-5 text-center">Loading dashboard data...</div>;
 
   if (error)
     return (
       <Alert variant="danger" className="m-4">
         {error}
       </Alert>
     );
 
   return (
     <>
       <div className="row px-5 mx-5 mb-5 mt-4">
         {[
           {
             title: "Total Reservations",
             value: dashboardData.totalReservations.toLocaleString(),
           },
           {
             title: "Revenue",
             value: `${dashboardData.revenue.toLocaleString()}`,
           },
           { title: "Success Bookings", value: dashboardData.successBooking },
           { title: "Pending Bookings", value: dashboardData.pendingBookings },
         ].map((item, index) => (
           <div key={index} className="col-md-3">
             <Card className="shadow-lg mb-1">
               <Card.Header
                 className="text-center text-white mb-1 fw-bold fs-5"
                 style={{ backgroundColor: "#6499E9" }}
               >
                 {item.title}
               </Card.Header>
               <Card.Body style={{ backgroundColor: "#f0f9ff" }}>
                 <Card.Text className="text-center fs-4">{item.value}</Card.Text>
               </Card.Body>
             </Card>
           </div>
         ))}
       </div>
 
       <Container>
         <h4 className="mb-3">Revenue Overview</h4>
         <Line data={chartData} />
       </Container>
     </>
   );
 };