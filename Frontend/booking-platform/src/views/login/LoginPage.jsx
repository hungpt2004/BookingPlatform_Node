import React, { useState } from 'react';
import CustomInput from '../../components/input/CustomInput';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import './LoginPage.css'
import { useNavigate, useNavigation } from 'react-router-dom';
import { MoonLoader, PulseLoader } from 'react-spinners';
import { useAuthStore } from '../../store/authStore';
import { GoogleLogin } from '@react-oauth/google'
import { Toast } from 'flowbite-react';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { CustomToast } from '../../components/toast/CustomToast';


export const LoginPage = () => {
<<<<<<< HEAD:Frontend/src/views/login/LoginPage.jsx
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState(''); // Sửa lỗi chính tả từ setPasword thành setPassword
   const navigate = useNavigate();
   
=======
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [showError, setShowError] = useState(false);
   const navigate = useNavigate(); //Navigation # Navigate nhu the nao ? 
   const [showToast, setShowToast] = useState(false);
   const [toastType, setToastType] = useState("success"); // success hoặc error

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

            toast.error("Đăng nhập thất bại", {
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

>>>>>>> main:Frontend/booking-platform/src/views/login/LoginPage.jsx
   return (
      <>
         <CustomToast />
         <Container fluid className='p-0 m-0'>
            <Row>
               <Col xs={8}>
                  <Image src='/hotel/travel.jpg' fluid style={{ objectFit: 'cover', height: '100vh', width: '100%' }} />
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
                     <CustomInput label="Username" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                     <CustomInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                     <p className="text-decoration-underline text-end mt-3 text-primary" style={{ fontSize: '16px', cursor: 'pointer' }}>
                        Forgot Password?
                     </p>
                     <Button
                        variant="primary"
                        className="mt-3 w-100"
                        type='submit'
                     >
                        {loading ? <PulseLoader size={10} color='white' /> : <>Sign In</>}
                     </Button>
                  </form>
                  <p className="text-center mt-3 text-primary" style={{ fontSize: '14px', cursor: 'pointer' }}>
                     <span className='text-dark'>No have an account ?</span> Sign In
                  </p>
                  {showError ? (error ? <p className='alert alert-danger'>{error}</p> : null) : null}
                  {showToast && (
                     <div className="fixed top-5 right-5">
                        <Toast>
                           {toastType === "success" ? (
                              <HiCheckCircle className="h-5 w-5 text-green-500" />
                           ) : (
                              <HiExclamationCircle className="h-5 w-5 text-red-500" />
                           )}
                           <div className="ml-3 text-sm font-normal">
                              {toastType === "success"
                                 ? "Đăng nhập thành công! 🎉"
                                 : "Đăng nhập thất bại! ❌"}
                           </div>
                        </Toast>
                     </div>
                  )}
               </Col>
            </Row>
         </Container>
      </>
   );
};

