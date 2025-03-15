import React, { useState, useEffect } from 'react';
// Components
import CustomInput from '../../components/input/CustomInput';
import { CustomPasswordInput } from '../../components/input/CustomPasswordInput';
// CSS
import { Modal, Spinner, Container } from 'react-bootstrap';
import './LoginPage.css'
// Router
import { useNavigate } from 'react-router-dom';
// Store
import { useAuthStore } from '../../store/authStore';
import { GoogleLogin } from '@react-oauth/google'
// Toast
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
// Animation
import { motion } from 'framer-motion';
import CustomInputLogin from '../../components/input/CustomInputLogin';

// Tạo CSS cho hiệu ứng nút 3D
const buttonStyles = `
  .button-3d {
    position: relative;
    width: 240px;
    height: 54px;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 1;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    transform-style: preserve-3d;
    transform: perspective(1000px) translateZ(0);
  }

  .button-3d:active {
    transform: perspective(1000px) translateZ(-10px);
    box-shadow: 0 3px 8px rgb(255, 255, 255);
  }

  /* Primary Button (Login) */
  .button-3d.primary {
    background-color: #003b95;
    color: white;
  }

  .button-3d.primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #0055d4;
    transition: width 0.3s ease;
    z-index: -1;
  }

  .button-3d.primary:hover::before {
    width: 100%;
  }

  .button-3d.primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
    z-index: -1;
  }

  /* Secondary Button (Register) */
  .button-3d.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
  }

  .button-3d.secondary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: width 0.3s ease;
    z-index: -1;
  }

  .button-3d.secondary:hover::before {
    width: 100%;
  }

  .button-3d.secondary::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
    z-index: -1;
  }

  /* Disabled state */
  .button-3d:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: perspective(1000px) translateZ(0) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
  }

  /* Spin animation for loading state */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoginPage = () => {
   // Navigation
   const navigate = useNavigate();

   // States
   const [showLoginModal, setShowLoginModal] = useState(false);
   const [showRegisterModal, setShowRegisterModal] = useState(false);
   const [isImageLoaded, setIsImageLoaded] = useState(false);

   // Login form states
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);

   // Register form states
   const [fullName, setFullName] = useState("");
   const [registerEmail, setRegisterEmail] = useState("");
   const [registerPassword, setRegisterPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [registerLoading, setRegisterLoading] = useState(false);

   // Auth store
   const { login, googleLogin, signup } = useAuthStore();


   // Preload background image
   useEffect(() => {
      const img = new Image();
      img.src = '/hotel/travel.jpg';
      img.onload = () => setIsImageLoaded(true);
   }, []);

   const handleLogin = async (e) => {
      e.preventDefault();

      if (!email || !password) {
         toast.error("Vui lòng nhập đầy đủ thông tin!", {
            position: "top-center",
            autoClose: 2000,
         });
         return;
      }

      setLoading(true);

      try {
         const userData = await login(email, password);
         toast.success("Đăng nhập thành công", {
            position: "top-center",
            autoClose: 2000,
         });
         setTimeout(() => {
            setLoading(false);
            setShowLoginModal(false);
            if (userData.data.user.role === 'OWNER') {
               navigate("/booking-management");
            } else {
               navigate("/home");
            }
         }, 2000);

      } catch (err) {
         setLoading(false);
         toast.error(err.message || "Đăng nhập thất bại", {
            position: "top-center",
            autoClose: 2000,
         });
      }
   };

   const handleSignUp = async (e) => {
      e.preventDefault();

      if (!fullName || !registerEmail || !registerPassword || !confirmPassword) {
         toast.error("Vui lòng nhập đầy đủ thông tin!", {
            position: "top-center",
            autoClose: 2000,
         });
         return;
      }

      if (registerPassword !== confirmPassword) {
         toast.error("Mật khẩu xác nhận không khớp!", {
            position: "top-center",
            autoClose: 2000,
         });
         return;
      }

      setLoading(true)
      try {
         const response = await signup(fullName, registerEmail, registerPassword);
         // Assuming response contains userId for verification

         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.success("Đăng kí thành công! Đợi xíu nha", {
               position: "top-center",
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });

            setTimeout(() => {
               navigate("/verify-email", {
                  state: {
                     userId: response.userId,
                     email: registerEmail,
                  },
               });
            }, 2000); // Chuyển trang sau khi toast hiển thị
         }, 1500);


      } catch (err) {
         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.error("Register Failed! Try again", {
               position: "top-center",
               autoClose: 2000,
            });
         }, 1500);
      }
   };

   // Handle Google login
   const handleGoogleLogin = async (credentialResponse) => {
      try {
         await googleLogin(credentialResponse.credential);

         toast.success("Đăng nhập thành công", {
            position: "top-center",
            autoClose: 2000,
         });

         // Close modal after successful login
         setTimeout(() => {
            setShowLoginModal(false);
            navigate("/home");
         }, 2000);

      } catch (error) {
         toast.error("Đăng nhập thất bại", {
            position: "top-center",
            autoClose: 2000,
         });
      }
   };

   return (
      <>
         {/* Inject custom CSS for 3D buttons */}
         <style>{buttonStyles}</style>

         <ToastContainer />

         {/* Main Landing Page */}
         <div
            className="vh-100 w-100 position-relative overflow-hidden"
            style={{
               backgroundImage: isImageLoaded ? "url('/hotel/travel.jpg')" : "none",
               backgroundColor: isImageLoaded ? "transparent" : "#003b95",
               backgroundSize: "cover",
               backgroundPosition: "center",
               transition: "background-color 0.5s ease"
            }}
         >
            {/* Dark Overlay */}
            <div
               className="position-absolute top-0 start-0 w-100 h-100"
               style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
               }}
            />

            {/* Main Content Container */}
            <Container className="position-relative h-100 d-flex flex-column justify-content-center align-items-center text-white">
               {/* Logo and Branding */}
               <motion.div
                  className="text-center mb-5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
               >
                  <div className="bg-white rounded-circle mx-auto mb-3" style={{ width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <div className="bg-primary rounded-circle" style={{ width: "60px", height: "60px" }}></div>
                  </div>
                  <h1 className="display-4 fw-bold mb-2">Travelofy</h1>
                  <p className="lead">Discover the world's most amazing places</p>
               </motion.div>

               {/* Welcome Text with Animation */}
               <motion.div
                  className="text-center mb-5"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               >
                  <h2 className="display-5 fw-light">Bắt đầu những trải nghiệm của bạn tại đây</h2>
               </motion.div>

               {/* Action Buttons */}
               <motion.div
                  className="d-flex flex-column gap-4 align-items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
               >
                  {/* 3D Login Button */}
                  <button
                     className="button-3d primary"
                     onMouseEnter={() => setLoginHovered(true)}
                     onMouseLeave={() => setLoginHovered(false)}
                     onClick={() => setShowLoginModal(true)}
                  >
                     Đăng nhập
                  </button>

                  {/* 3D Register Button */}
                  <button
                     className="button-3d secondary"
                     onMouseEnter={() => setRegisterHovered(true)}
                     onMouseLeave={() => setRegisterHovered(false)}
                     onClick={() => setShowRegisterModal(true)}
                  >
                     Đăng ký
                  </button>
               </motion.div>
            </Container>
         </div>

         {/* Login Modal */}
         <Modal
            show={showLoginModal}
            onHide={() => setShowLoginModal(false)}
            centered
            backdrop="static"
            size="md"
         >
            <Modal.Header closeButton className="border-0 pb-0">
               <Modal.Title className="w-100 text-center">
                  <h4 className="fw-bold">Đăng nhập vào Travelofy</h4>
               </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 pt-0">
               <form onSubmit={handleLogin}>
                  <div className="d-flex align-items-center justify-content-center my-4">
                     <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.log("Google login failed")}
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text="continue_with"
                        logo_alignment="center"
                     />
                  </div>

                  <div className="d-flex align-items-center my-4">
                     <hr className="flex-grow-1 me-2" />
                     <span className="text-muted">or</span>
                     <hr className="flex-grow-1 ms-2" />
                  </div>

                  <CustomInputLogin
                     label="Email or Username"
                     type="text"
                     value={email}
                     placeHolder="Enter your email or username"
                     onChange={(e) => setEmail(e.target.value)}
                  />

                  <CustomPasswordInput
                     label="Password"
                     value={password}
                     placeHolder="Enter your password"
                     onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                     <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">
                           Remember me
                        </label>
                     </div>

                     <p
                        className="m-0 text-primary"
                        style={{ fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/forgot')}
                     >
                        Forgot Password?
                     </p>
                  </div>

                  <button
                     className="button-3d primary w-100 mb-3"
                     type="submit"
                     disabled={loading}
                  >
                     {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                     ) : (
                        "Sign In"
                     )}
                  </button>

                  <p className="text-center mb-0" style={{ fontSize: '14px' }}>
                     <span>Bạn chưa có tài khoản?</span>{' '}
                     <span
                        className="text-primary"
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => {
                           setShowLoginModal(false);
                           setTimeout(() => setShowRegisterModal(true), 300);
                        }}
                     >
                        Đăng ký
                     </span>
                  </p>
               </form>
            </Modal.Body>
         </Modal>

         {/* Register Modal */}
         <Modal
            show={showRegisterModal}
            onHide={() => setShowRegisterModal(false)}
            centered
            backdrop="static"
            size="md"
         >
            <Modal.Header closeButton className="border-0 pb-0">
               <Modal.Title className="w-100 text-center">
                  <h4 className="fw-bold">Create your account</h4>
               </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 pt-0">
               <form onSubmit={handleSignUp}>

                  <div className="d-flex align-items-center justify-content-center my-4">
                     <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.log("Google login failed")}
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text="continue_with"
                        logo_alignment="center"
                     />
                  </div>

                  <div className="d-flex align-items-center my-4">
                     <hr className="flex-grow-1 me-2" />
                     <span className="text-muted">or</span>
                     <hr className="flex-grow-1 ms-2" />
                  </div>

                  <CustomInputLogin
                     label="Full Name"
                     type="text"
                     value={fullName}
                     placeHolder="Enter your full name"
                     onChange={(e) => setFullName(e.target.value)}
                  />

                  <CustomInputLogin
                     label="Email"
                     type="email"
                     value={registerEmail}
                     placeHolder="Enter your email"
                     onChange={(e) => setRegisterEmail(e.target.value)}
                  />

                  <CustomPasswordInput
                     label="Password"
                     value={registerPassword}
                     placeHolder="Create a password"
                     onChange={(e) => setRegisterPassword(e.target.value)}
                  />

                  <CustomPasswordInput
                     label="Confirm Password"
                     value={confirmPassword}
                     placeHolder="Confirm your password"
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button
                     className="button-3d primary w-100 my-4"
                     type="submit"
                     disabled={registerLoading}
                  >
                     {registerLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                     ) : (
                        "Create Account"
                     )}
                  </button>

                  <p className="text-center mb-0" style={{ fontSize: '14px' }}>
                     <span>Bạn đã có tài khoản rồi?</span>{' '}
                     <span
                        className="text-primary"
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => {
                           setShowRegisterModal(false);
                           setTimeout(() => setShowLoginModal(true), 300);
                        }}
                     >
                        Đăng nhập
                     </span>
                  </p>
               </form>
            </Modal.Body>
         </Modal>
      </>
   );
};