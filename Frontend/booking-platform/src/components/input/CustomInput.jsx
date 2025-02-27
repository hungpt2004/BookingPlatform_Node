import React from 'react'
import { Form } from 'react-bootstrap'

const CustomInput = ({ label, type, value, onChange, placeHolder }) => {
   return (
      <>
         <Form.Label className='mb-2' htmlFor='input'>{label}</Form.Label>
         <Form.Control 
            className='rounded-0 p-3'
            type={type}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            required
         />
      </>
   )
}

export default CustomInput
