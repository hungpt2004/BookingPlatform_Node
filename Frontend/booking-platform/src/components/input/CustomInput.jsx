import React from 'react'
import { Form } from 'react-bootstrap'

const CustomInput = ({ label, type, value, onChange, placeHolder }) => {
   return (
      <>
         <Form.Control 
            className='rounded-0 p-3'
            type={type}
            min={type === 'number' ? 0 : null}
            max={type === 'number' ? 200 : null}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            required
         />
      </>
   )
}

export default CustomInput
