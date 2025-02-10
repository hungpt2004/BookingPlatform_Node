import React, { useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { MoonLoader, PulseLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { CustomToast } from '../../components/toast/CustomToast';
import { useAuthStore } from '../../store/authStore';
import CustomInput from '../../components/input/CustomInput';
import { CustomPasswordInput } from '../../components/input/CustomPasswordInput';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../../components/password_strength_meter/PasswordStrengthMeter';
import { GoogleLogin } from '@react-oauth/google'

export const RegisterPage = () => {

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const { signup, isLoading, error, googleLogin } = useAuthStore();

   const handleSignUp = async (e) => {
      e.preventDefault();
      setLoading(true)
      try {
         const response = await signup(username, email, password);
         // Assuming response contains userId for verification

         setTimeout(() => {
            setLoading(false); // Tắt loading sau 1.5s

            toast.success("Register Success! Wait a few seconds", {
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
                     email: email,
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

   const handleGoogleLogin = async (credentialResponse) => {
      try {
         await googleLogin(credentialResponse.credential);
      } catch (error) {
         console.error("Google login failed", error);
      }
   };



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
                  <form onSubmit={handleSignUp}>
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
                     <CustomInput placeHolder="Enter email" label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                     <CustomInput placeHolder="Enter username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                     <CustomPasswordInput placeHolder="Enter password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                     <PasswordStrengthMeter password={password} />
                     <p className="text-decoration-underline text-end mt-3 text-primary" style={{ fontSize: '16px', cursor: 'pointer' }}>
                        Forgot Password?
                     </p>
                     <Button
                        variant="primary"
                        className="mt-3 w-100"
                        type='submit'
                     >
                        {loading ? <PulseLoader size={10} color='white' /> : <>Sign Up</>}
                     </Button>
                  </form>
                  <p className="text-center mt-3 text-primary" style={{ fontSize: '14px', cursor: 'pointer' }}>
                     <span className='text-dark'>Already have an account ?</span> <span onClick={() => navigate('/')} style={{ textDecorationLine: 'underline' }}>Sign Up</span>
                  </p>
               </Col>
            </Row>
         </Container>
      </>
   )
}
