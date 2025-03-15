import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import CustomerProfileSetting from "./views/customer/CustomerProfileSetting";
import FeedbackPage from "./views/feedback/feedback";
import CancelPaymentPage from "./views/status/CancelPaymentPage";
import DashboardPage from "./views/dashBoard/DashboardPage";
import DashboardOverview from "./views/dashBoard/DashboardPage";
import Receipt from "./views/receipt/ReceiptPaymentPage";
import MonthlyPayment from "./views/monthly_payment/MonthlyPaymentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/transaction" element={<HistoryTransaction />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/booking-step2" element={<BookingStepTwo />} />
        <Route path="/hotel-detail/:id" element={<HotelDetailPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/success/:id" element={<SuccessPaymentPage />} />
        <Route path="/cancel/:id" element={<CancelPaymentPage />} />
        <Route path="/update-customer" element={<CustomerProfileSetting />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/receipt/:id" element={<Receipt />}/> 
        <Route path="/monthly-owner" element={<MonthlyPayment/>}/>
      </Routes>
    </Router>
  );
}

export default App;
