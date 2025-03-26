import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { CustomToast } from '../../components/toast/CustomToast';
import { Spinner } from 'flowbite-react';

export const EmailVerificationPage = () => {
   const [code, setCode] = useState(["", "", "", "", "", ""]);
   const [resendTimer, setResendTimer] = useState(20);
   const [canResend, setCanResend] = useState(false);
   const [actionLoading, setActionLoading] = useState(null); // Tracks loading action
   const [loading, setLoading] = useState(false)
   const inputRefs = useRef([]);
   const navigate = useNavigate();
   const location = useLocation();
   const { email } = location.state || {};

   const { error, verifyEmail, resendVerification } = useAuthStore();

   useEffect(() => {
      if (resendTimer > 0) {
         const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
         }, 1000);
         return () => clearInterval(timer);
      } else {
         setCanResend(true);
      }
   }, [resendTimer]);

   const handleChange = (index, value) => {
      const newCode = [...code];

      // Handle pasted content
      if (value.length > 1) {
         const pastedCode = value.slice(0, 6).split("");
         for (let i = 0; i < 6; i++) {
            newCode[i] = pastedCode[i] || "";
         }
         setCode(newCode);

         // Focus on the last non-empty input or the first empty one
         const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
         const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
         inputRefs.current[focusIndex].focus();
      } else {
         newCode[index] = value;
         setCode(newCode);

         // Move focus to the next input field if value is entered
         if (value && index < 5) {
            inputRefs.current[index + 1].focus();
         }
      }
   };

   const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
         inputRefs.current[index - 1].focus();
      }
   };

   const handleResend = async () => {
      if (!canResend || actionLoading === "resending") return;

      try {
         setActionLoading("resending");
         await resendVerification(email);
         setResendTimer(60); // Adjust timer duration as needed
         setCanResend(false);
         setCode(["", "", "", "", "", ""]);
         inputRefs.current[0].focus();
         toast.success("Verification code resent to your email");
      } catch (error) {
         toast.error(error.message || "Failed to resend verification code");
      } finally {
         setActionLoading(null);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const verificationCode = code.join("");
      if (actionLoading === "verifying") return;
      setLoading(true)
      try {
         setActionLoading("verifying");
         await verifyEmail(email, verificationCode);
         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.success("Verify Success! Wait a few seconds", {
               position: "top-center",
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });

            setTimeout(() => {
               navigate("/");
            }, 2000); // Chuyển trang sau khi toast hiển thị
         }, 1500);

      } catch (error) {
         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.error(error.message, {
               position: "top-center",
               autoClose: 2000,
            });
         }, 1500);
      } finally {
         setActionLoading(null);
      }
   };

   // Auto submit when all fields are filled
   // useEffect(() => {
   //    if (code.every((digit) => digit !== "")) {
   //       handleSubmit(new Event("submit"));
   //    }
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [code]);


   return (
      <>
         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <motion.div
               initial={{ opacity: 0, y: -50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="card shadow-lg border-0 rounded-4 p-4"
               style={{ maxWidth: "400px", color: "black" }}
            >
               <div className="card-body">
                  <h2 className="text-center mb-3 fw-bold text-gradient">
                     Verify Your Email
                  </h2>
                  <p className="text-center text-dark mb-4">
                     Enter the 6-digit code sent to your email.
                  </p>

                  <form onSubmit={handleSubmit}>
                     <div className="d-flex justify-content-between mb-3">
                        {code.map((digit, index) => (
                           <input
                              key={index}
                              ref={(el) => (inputRefs.current[index] = el)}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className="form-control text-center fs-4 fw-bold rounded-3"
                              style={{ width: "50px", height: "50px", color: "black" }}
                           />
                        ))}
                     </div>
                     {error && <p className="text-danger text-center">{error}</p>}

                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={actionLoading === "verifying" || code.some((digit) => !digit)}
                        className="btn btn-primary w-100 py-2 fw-bold"
                     >
                        {actionLoading === "verifying" ? "Verifying..." : "Verify Email"}
                        {/* {loading ? <Spinner color='info' aria-label="Loading..."/> : "Verify Email"} */}
                     </motion.button>
                  </form>

                  <div className="text-center mt-3">
                     <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || actionLoading === "resending"}
                        className="btn btn-link text-decoration-none text-info"
                     >
                        {actionLoading === "resending"
                           ? "Sending..."
                           : canResend
                              ? "Resend"
                              : `Resend after ${resendTimer}s`}
                     </button>
                  </div>
               </div>
            </motion.div>
         </div>
      </>
   )
}
