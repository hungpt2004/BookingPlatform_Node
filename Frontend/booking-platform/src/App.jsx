import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from "./views/login/LoginPage"
import { HomePage } from "./views/home/HomePage"
import { HistoryTransaction } from "./views/transaction/HistoryTransaction"
import './App.css'
import { RegisterPage } from "./views/register/RegisterPage"
import { EmailVerificationPage } from "./views/verify_email/EmailVerificationPage"
import BookingStepTwo from "./views/booking/BookingStepTwo"
import { HotelDetailPage } from "./views/details/HotelDetailPage"
import ForgotPasswordPage from "./views/forgot_password/ForgotPasswordPage"
import ResetPasswordPage from "./views/reset_password/ResetPasswordPage"
import BookingStepTwo from "./views/booking/BookingStepTwo"

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
        <Route path="/booking-step2/" element={<BookingStepTwo />} />
      </Routes>
    </Router>
  )
}

export default App
