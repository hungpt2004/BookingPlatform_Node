import React, { useState } from 'react';
// Components
import CustomInput from '../../components/input/CustomInput';
import { CustomPasswordInput } from '../../components/input/CustomPasswordInput';
// CSS
import { Button, Col, Container, Image, Row, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './LoginPage.css'
// Router
import { useNavigate, useNavigation } from 'react-router-dom';
// Spinner
import { MoonLoader, PulseLoader } from 'react-spinners';
// GG Login
import { useAuthStore } from '../../store/authStore';
import { GoogleLogin } from '@react-oauth/google'
// Icon
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import { FaRegEyeSlash } from "react-icons/fa";
// Toast
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { CustomToast } from '../../components/toast/CustomToast';
// Animation
import UseTime from './UseTime.jsx';
import DragBox from '../../components/animation/DragBox.jsx';
import { motion } from 'framer-motion';  // Import motion

export const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [showError, setShowError] = useState(false);
   const navigate = useNavigate(); //Navigation # Navigate nhu the nao ? 
   const [showToast, setShowToast] = useState(false);
   const [toastType, setToastType] = useState("success"); // success hoặc error
   const [showPassword, setShowPassword] = useState(false);

   const { login, isLoading, error, googleLogin } = useAuthStore();

   const handleLogin = async (e) => {
      e.preventDefault();
      setShowError(false);
      setLoading(true); // Bắt đầu loading

      try {
         await login(email, password);

         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.success("Đăng nhập thành công", {
               position: "top-center",
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });

            setTimeout(() => {
               navigate("/home");
            }, 2000); // Chuyển trang sau khi toast hiển thị
         }, 1500);

      } catch (err) {
         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.error(err.message, {
               position: "top-center",
               autoClose: 2000,
            });
         }, 1500);
      }
   };


   const handleGoogleLogin = async (credentialResponse) => {
      try {
         await googleLogin(credentialResponse.credential);

         toast.success("Đăng nhập thành công", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
         });

         setTimeout(() => {
            navigate("/home");
         }, 2000); // Chuyển trang sau khi toast hiển thị

      } catch (error) {
         toast.error("Đăng nhập thất bại", {
            position: "top-center",
            autoClose: 2000,
         });
      }
   };

   return (
      <>
         <CustomToast />
         <Container fluid className='p-0 m-0'>
            <Row>
               <Col xs={8} className='position-relative'>
                  <Image src='/hotel/travel.jpg' fluid style={{ objectFit: 'cover', height: '100vh', width: '100%' }} />
                  <div
                     className='position-absolute top-0 start-0 w-100 h-100'
                     style={{
                        backdropFilter: 'blur(3px)', // Làm mờ nền
                        backgroundColor: 'rgba(0, 0, 0, 0.3)' // Kết hợp với màu tối
                     }}
                  ></div>
                  <motion.div
                     className="position-absolute translate-middle text-light text-center top-50 start-50"
                     style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '20px',
                        borderRadius: '10px'
                     }}
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                     <p className="fs-1 fw-bolder">Welcome to Travelofy</p>
                     <p className="fs-5 fw-medium">Enjoy Your Blast Time</p>
                  </motion.div>
               </Col>
               <Col className='justify-content-center align-content-center border-dark p-5' style={{ borderWidth: '1px', borderColor: 'black' }}>
                  <h1 className='text-center mb-5 fw-bold'>Login System</h1>
                  <form onSubmit={handleLogin}>
                     <div className='d-flex align-items-center justify-content-center mb-4'>
                        <GoogleLogin
                           onSuccess={handleGoogleLogin}
                           onError={() => console.log("Google login failed")}
                           shape="rectangular"
                           theme="outline"
                           size="large"
                           width="320"
                           text="continue_with"
                           logo_alignment="center"
                           useOneTap={false}
                        />
                     </div>
                     <CustomInput label="Username" type="text" value={email} placeHolder={"Enter username"} onChange={(e) => setEmail(e.target.value)} />
                     <CustomPasswordInput label="Password" value={password} placeHolder={"Enter password"} onChange={(e) => setPassword(e.target.value)} />
                     <p className="text-decoration-underline text-end mt-3 text-primary" style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => navigate('/forgot')}>
                        Forgot Password?
                     </p>
                     <Button
                        variant="primary"
                        className="mt-3 w-100"
                        type="submit"
                        style={{ height: "45px" }} // Đặt chiều cao cố định
                     >
                        {loading ? (
                           <Spinner animation="border" style={{ width: 30, height: 30 }} role="status" />
                        ) : (
                           "Sign In"
                        )}
                     </Button>
                  </form>
                  <p className="text-center mt-3 text-primary" style={{ fontSize: '14px', cursor: 'pointer' }}>
                     <span className='text-dark'>No have an account ?</span> <span onClick={() => navigate('/register')} style={{ textDecorationLine: 'underline' }}>Sign In</span>
                  </p>
                  {showError ? (error ? <p className='alert alert-danger'>{error}</p> : null) : null}
               </Col>
            </Row>
         </Container>
      </>
   );
};

