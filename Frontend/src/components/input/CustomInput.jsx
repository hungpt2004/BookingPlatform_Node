import React from 'react'
import { Form } from 'react-bootstrap'

const CustomInput = ({ label, type, value, onChange, placeHolder }) => {
   return (
      <>
         <Form.Label className='mb-2' htmlFor='input'>{label}</Form.Label>
         <Form.Control
            type={type}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
         />
      </>
   )
}

export default CustomInput
