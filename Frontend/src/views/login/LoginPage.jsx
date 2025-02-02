// import React, { useState } from 'react';
// import CustomInput from '../../components/input/CustomInput';
// import { Button, Container } from 'react-bootstrap';
// import './LoginPage.css'
// import { useNavigate } from 'react-router-dom';

// export const LoginPage = () => {
//    const [username, setUsername] = useState('');
//    const [password, setPassword] = useState(''); // Sửa lỗi chính tả từ setPasword thành setPassword
//    const navigate = useNavigate();

//    return (
//       <>
//       <Container fluid className="row justify-content-center align-items-center" style={{ height: '100vh', width: '100%' }}>
//          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
//             <div className="card card-body px-5 py-4 container-login" style={{ maxWidth: '400px', width: '100%' }}>
//                <CustomInput label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//                <CustomInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                <p className="text-decoration-underline text-end mt-3 text-primary" style={{fontSize: '12px'}}>
//                   Forgot Password?
//                </p>
//                <Button 
//                   variant="primary" 
//                   className="mt-3 w-100"
//                   onClick={() => navigate('/home')}   
//                >
//                   Sign In
//                </Button>
//                <p className="text-center mt-3 text-primary" style={{fontSize: '14px'}}>
//                   <span className='text-dark'>No have an account ?</span> Sign In
//                </p>
//             </div>
//          </div>
//       </Container>
//       </>
//    );
// };

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/authStore";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error, googleLogin } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <div className="w-full flex justify-center mb-4">
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-800 bg-opacity-50">
                OR
              </span>
            </div>
          </div>

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
