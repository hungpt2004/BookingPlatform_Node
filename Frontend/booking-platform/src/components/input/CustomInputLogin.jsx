import React from 'react'
import { Form } from 'react-bootstrap'

const CustomInputLogin = ({ label, type, value, onChange, placeHolder }) => {
   return (
      <>
         <Form.Label className='mt-2 mb-0' htmlFor='input'>{label}</Form.Label>
         <Form.Control 
            className='rounded-2 p-2 mb-2'
            type={type}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
         />
      </>
   )
}

export default CustomInputLogin
