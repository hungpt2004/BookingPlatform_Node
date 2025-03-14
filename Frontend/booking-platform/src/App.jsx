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
import { SuccessPaymentPage } from "./views/status/SuccessPaymentPage"
import FavoriteHotelsList from "./views/favorite/FavoriteHotelsList"
import CustomerProfileSetting from "./views/customer/CustomerProfileSetting"
import FeedbackPage from './views/feedback/feedback'
import { Createhotel } from './views/hotel/Createhotel'
import { CreateRoom } from './views/room/createRoom'
import CancelPolicy from './views/room/roomPriceType/CancelPolicy'
import PricePerPerson from './views/room/roomPriceType/PricePerCapacity'
import PriceNoRefund from './views/room/roomPriceType/PriceNoRefund'
import PricePerWeek from './views/room/roomPriceType/PricePerWeek'
import HotelPhotos from './views/hotel/CreateHotelPhotos'
import BookingManagePage from './views/owner/BookingManagePage'

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
        <Route path="/cancel/:id" element={<SuccessPaymentPage />} />
        <Route path="/favorite-list" element={<FavoriteHotelsList />} />

        <Route path="/update-customer" element={<CustomerProfileSetting />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/create-hotel" element={<Createhotel />} />
        <Route path='/create-room' element={<CreateRoom />} />
        <Route path='/cancel-policy' element={<CancelPolicy />} />
        <Route path='/edit-capacity-price' element={<PricePerPerson />} />
        <Route path='/edit-non-refundable' element={<PriceNoRefund />} />
        <Route path='/edit-weekly-price' element={<PricePerWeek />} />
        <Route path='/create-photo' element={<HotelPhotos />} />
        <Route path='booking-management' element={<BookingManagePage />} />

      </Routes>
    </Router>
  )
}

export default App