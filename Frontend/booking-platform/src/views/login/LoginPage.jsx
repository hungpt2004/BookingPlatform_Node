import React, { useState } from 'react';
import CustomInput from '../../components/input/CustomInput';
import { Button, Container } from 'react-bootstrap';
import './LoginPage.css'

export const LoginPage = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState(''); // Sửa lỗi chính tả từ setPasword thành setPassword

   return (
      <Container fluid className="row justify-content-center align-items-center" style={{ height: '100vh', width: '100%' }}>
         <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="card card-body px-5 py-4 container-login" style={{ maxWidth: '400px', width: '100%' }}>
               <CustomInput label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
               <CustomInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <p className="text-decoration-underline text-end mt-3 text-primary" style={{fontSize: '12px'}}>
                  Forgot Password?
               </p>
               <Button variant="primary" className="mt-3 w-100">
                  Sign In
               </Button>
               <p className="text-center mt-3 text-primary" style={{fontSize: '14px'}}>
                  <span className='text-dark'>No have an account ?</span> Sign In
               </p>
            </div>
         </div>
      </Container>
   );
};
