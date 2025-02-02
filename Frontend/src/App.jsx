import FloatingShape from "./components/FloatingShape";
import { Routes, Route, Navigate } from "react-router-dom";
// import { LoginPage } from "./views/login/LoginPage"
// import { HomePage } from "./views/home/HomePage";
// import { HistoryTransaction } from "./views/transaction/HistoryTransaction";
import SignUpPage from "./views/signUp/SignUpPage";
import LoginPage from "./views/login/LoginPage";
import ResetPasswordPage from "./views/resetPassword/ResetPasswordPage";
import ForgotPasswordPage from "./views/forgotPassword/ForgotPasswordPage";
import EmailVerificationPage from "./views/verify/EmailVerificationPage";
import DashboardPage from "./views/dashBoard/DashboardPage";
function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<LoginPage />} />
    //     <Route path="/home" element={<HomePage />} />
    //     <Route path="/transaction" element={<HistoryTransaction />} />
    //   </Routes>
    // </Router>
    <div
      className="min-h-screen bg-gradient-to-br
  from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-[#6499E9]"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#9EDDFF]"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#A6F6FF]"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
