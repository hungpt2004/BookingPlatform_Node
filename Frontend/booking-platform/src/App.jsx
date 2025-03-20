import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginPage } from "./views/login/LoginPage";
import { HomePage } from "./views/home/HomePage";
import { HistoryTransaction } from "./views/transaction/HistoryTransaction";
import "./App.css";
import { RegisterPage } from "./views/register/RegisterPage";
import { EmailVerificationPage } from "./views/verify_email/EmailVerificationPage";
import BookingStepTwo from "./views/booking/BookingStepTwo";
import { HotelDetailPage } from "./views/details/HotelDetailPage";
import ForgotPasswordPage from "./views/forgot_password/ForgotPasswordPage";
import ResetPasswordPage from "./views/reset_password/ResetPasswordPage";
import { SuccessPaymentPage } from "./views/status/SuccessPaymentPage";
import FavoriteHotelsList from "./views/favorite/FavoriteHotelsList"
import CustomerProfileSetting from "./views/customer/CustomerProfileSetting";
import FeedbackPage from "./views/feedback/feedback";
import CancelPaymentPage from "./views/status/CancelPaymentPage";
import DashboardPage from "./views/dashBoard/DashboardPage";
import DashboardOverview from "./views/dashBoard/DashboardPage";
import Receipt from "./views/receipt/ReceiptPaymentPage";
import MonthlyPayment from "./views/monthly_payment/MonthlyPaymentPage";
import { useAuthStore } from "./store/authStore";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/authRoutes/ProtectedRoute";
import AdminDashboard from "./views/admin/AdminDashboard";
import { Spinner } from "react-bootstrap";
import { Createhotel } from './views/hotel/Createhotel'
import { CreateRoom } from './views/room/createRoom'
import CancelPolicy from './views/room/roomPriceType/CancelPolicy'
import PricePerPerson from './views/room/roomPriceType/PricePerCapacity'
import PriceNoRefund from './views/room/roomPriceType/PriceNoRefund'
import PricePerWeek from './views/room/roomPriceType/PricePerWeek'
import HotelPhotos from './views/hotel/CreateHotelPhotos'
import BookingManagePage from './views/owner/BookingManagePage'
import ReviewPage from './views/owner/ReviewPage'
import HotelReservations from './views/owner/BookingSchedule'
import HotelDetailOwnerPage from './views/owner/HotelDetailOwner'
import BookingSchedule from "./views/owner/BookingSchedule";
import RoomManagePage from "./views/owner/RoomManagement";
import OwnerHomePage from './views/owner/HomePage'
import FinancePage from './views/owner/FinancePage'
import CustomPartnerPage from "./views/customer/CustomerPartnerPage";
import HotelManagementPage from "./views/hotel/HotelManagementPage";
import FeedbackTable from "./views/feedback/FeedbackOwnerPage";
import ServiceTable from "./views/service/ServiceManagementPage";
import FavoriteListPage from "./views/favorite/FavoriteListPage";


function App() {
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const token = sessionStorage.getItem("token");

    if (token) {
      // Here you would typically verify the token and load user data
      // For now we'll just simulate that with a timeout
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền mờ nhẹ
          zIndex: 9999,
        }}
      >
        <Spinner animation="border" size="lg" style={{ color: "#003b95" }} />
      </div>
    );
  }

  // Role-based redirect component
  const RoleRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/" />;

    switch (user.role) {
      case "OWNER":
        return <Navigate to="/dashboard" />;
      case "ADMIN":
        return <Navigate to="/admin-dashboard" />;
      case "CUSTOMER":
        return <Navigate to="/home" />;
      default:
        return <Navigate to="/home" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible to all */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/redirect" element={<RoleRedirect />} />

        {/* Note sửa lỗi home */}
        <Route path="/home" element={<HomePage />} />

        {/* Customer routes */}
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="/transaction" element={<HistoryTransaction />} />
          <Route path="/booking-step2" element={<BookingStepTwo />} />
          <Route path="/hotel-detail/:id" element={<HotelDetailPage />} />
          <Route path="/success/:id" element={<SuccessPaymentPage />} />
          <Route path="/cancel/:id" element={<CancelPaymentPage />} />
          <Route path="/update-customer" element={<CustomerProfileSetting />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/favorite" element={<FavoriteListPage />} />
        </Route>

        {/* Owner routes */}
        <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/monthly-owner" element={<MonthlyPayment />} />
          <Route path='/booking-management' element={<BookingManagePage />} />
          <Route path='/room-management' element={<RoomManagePage />} />
          <Route path='/booking-schedule/:hotelId' element={<HotelReservations/>}/>
          <Route path='/detail/:hotelId' element={<HotelDetailOwnerPage/>}/>
          <Route path="/hotel-management" element={<HotelManagementPage />} />
          <Route path="/feedback-management" element={<FeedbackTable />} />
          <Route path="/service-management" element={<ServiceTable />} />
          <Route path="/booking-management" element={<BookingManagePage />} />
          <Route path="/booking-schedule" element={<BookingSchedule />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/customer-partner" element={<CustomPartnerPage />} />
          <Route path="/hotel-partner" />
        </Route>

        {/* Catch-all route - redirects to appropriate homepage based on role */}
        <Route path="*" element={<RoleRedirect />} />

        <Route path="/create-hotel" element={<Createhotel />} />
        <Route path='/create-room' element={<CreateRoom />} />
        <Route path='/cancel-policy' element={<CancelPolicy />} />
        <Route path='/edit-capacity-price' element={<PricePerPerson />} />
        <Route path='/edit-non-refundable' element={<PriceNoRefund />} />
        <Route path='/edit-weekly-price' element={<PricePerWeek />} />
        <Route path='/create-photo' element={<HotelPhotos />} />
        <Route path='/owner-homepage' element={<OwnerHomePage />} />
        <Route path='/owner-finance' element={<FinancePage />} />
        <Route path='/booking-management' element={<BookingManagePage />} />
        <Route path='/reviews' element={<ReviewPage />} />
        <Route path='/booking-schedule/:hotelId' element={<HotelReservations/>}/>     
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path='/detail/:hotelId' element={<HotelDetailOwnerPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
