import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from "./views/login/LoginPage"
import { HomePage } from "./views/home/HomePage"
import BookingStepTwo from "./components/booking/BookingStepTwo"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/booking-step2" element={<BookingStepTwo />} />
      </Routes>
    </Router>
  )
}

export default App
