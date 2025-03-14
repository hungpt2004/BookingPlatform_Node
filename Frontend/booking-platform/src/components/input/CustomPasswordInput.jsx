import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { Form } from 'react-bootstrap'
import { InputGroup } from 'react-bootstrap';

export const CustomPasswordInput = ({ label, value, onChange, placeHolder }) => {

   const [showPassword, setShowPassword] = useState(false);

   const seePassword = () => {
      setShowPassword(!showPassword)
   }

   return (
      <>
         <Form.Label className='mt-2 mb-0' htmlFor='input'>{label}</Form.Label>
         <InputGroup>
            <Form.Control
               className='rounded-1 p-2 mb-3'
               type={!showPassword ? 'password' : 'text'}
               placeholder={placeHolder}
               value={value}
               onChange={onChange}
               // required
            />
           <InputGroup.Text className='mb-3' onClick={() => seePassword()} style={{ cursor: 'pointer' }}>
               {showPassword ? <IoEyeSharp size={20} /> : <FaEyeSlash size={20} />}
            </InputGroup.Text>
         </InputGroup>
      </>
   )
}
